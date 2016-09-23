define(["require", "exports", './pager-settings', './pager-templates', './pd-pager-options'], function (require, exports, pager_settings_1, pager_templates_1, pd_pager_options_1) {
    "use strict";
    var PdPager = (function () {
        function PdPager(options, parentElement, logger) {
            this.logger = logger;
            parentElement = parentElement || document.body;
            this.logger = this.logger || console;
            options = new pd_pager_options_1.PdPagerOptions(options);
            this.logger.debug('constructor');
            var firstPage = options.convertFromDecimal(options.firstPage);
            this.currentPage = firstPage;
            var settings = this.buildSettings(options);
            var pagerHtml = this.buildPager(options, settings);
            parentElement.appendChild(pagerHtml);
        }
        Object.defineProperty(PdPager.prototype, "displayPageInput", {
            get: function () {
                return parseInt(document.getElementById('page-input').value, 10);
            },
            set: function (value) {
                var inputElement = document.getElementById('page-input');
                if (inputElement) {
                    inputElement.value = value.toString();
                }
            },
            enumerable: true,
            configurable: true
        });
        PdPager.prototype.buildSettings = function (options) {
            this.logger.debug('buildSettings');
            var settings = new pager_settings_1.PagerSettings();
            settings.convertFromDecimal = options.convertFromDecimal.bind(this);
            settings.convertToDecimal = options.convertToDecimal.bind(this);
            settings.firstPage = options.convertFromDecimal(options.firstPage);
            settings.maximumNumberOfExplicitPagesToDisplay = options.maximumNumberOfExplicitPagesToDisplay;
            settings.totalPages = options.convertFromDecimal(options.totalPages);
            settings.canPageBackward = this.currentPage > settings.firstPage;
            settings.canPageForward = this.currentPage < settings.totalPages;
            settings.hasMorePagesBackward = false;
            settings.hasMorePagesForward = false;
            if (this.currentPage > settings.firstPage + 2
                && settings.totalPages > settings.maximumNumberOfExplicitPagesToDisplay) {
                settings.hasMorePagesBackward = true;
            }
            if (this.currentPage < settings.totalPages - 2
                && settings.totalPages > settings.maximumNumberOfExplicitPagesToDisplay) {
                settings.hasMorePagesForward = true;
            }
            var rangeStart;
            var rangeEnd;
            if (!settings.hasMorePagesBackward && !settings.hasMorePagesForward) {
                rangeStart = settings.firstPage + 1;
                rangeEnd = settings.totalPages;
            }
            else if (!settings.hasMorePagesBackward) {
                rangeStart = settings.firstPage + 1;
                rangeEnd = settings.maximumNumberOfExplicitPagesToDisplay - 1;
            }
            else if (!settings.hasMorePagesForward) {
                rangeEnd = settings.totalPages;
                rangeStart = settings.totalPages - settings.maximumNumberOfExplicitPagesToDisplay + 3;
            }
            else {
                var hasOddNumberOfButtons = (settings.maximumNumberOfExplicitPagesToDisplay % 2) === 1;
                var x = Math.ceil((settings.maximumNumberOfExplicitPagesToDisplay - 5) / 2);
                if (this.currentPage + x === settings.totalPages - 2) {
                    settings.hasMorePagesForward = false;
                    rangeStart = this.currentPage - x;
                    rangeEnd = settings.totalPages;
                }
                else {
                    if (hasOddNumberOfButtons) {
                        rangeStart = this.currentPage - x;
                        rangeEnd = this.currentPage + x + 1;
                    }
                    else {
                        rangeStart = this.currentPage - x + 1;
                        rangeEnd = this.currentPage + x + 1;
                    }
                }
            }
            settings.pagesRange = [];
            for (; rangeStart < rangeEnd; rangeStart++) {
                settings.pagesRange.push({ displayPage: options.convertFromDecimal(rangeStart), page: rangeStart });
            }
            this.settings = settings;
            return settings;
        };
        PdPager.prototype.buildPager = function (options, settings) {
            var _this = this;
            var templates = new pager_templates_1.PagerTemplates();
            var pagerHtmlBeginning = '';
            var pagerHtmlEnding = '';
            if (options.enableFirstLastPageArrows) {
                pagerHtmlBeginning += this.buildButton(templates.pageToBeginningHtml, 'arrow-page-to-beginning', !settings.canPageBackward, 'pageToBeginning()');
                pagerHtmlEnding = "" + this.buildButton(templates.pageToEndHtml, 'arrow-page-to-end', !settings.canPageForward, 'pageToEnd()') + pagerHtmlEnding;
            }
            if (options.enablePageArrows) {
                pagerHtmlBeginning += this.buildButton(templates.pageRetreatHtml, 'arrow-page-retreat', !settings.canPageBackward, 'retreat()');
                pagerHtmlEnding = "" + this.buildButton(templates.pageAdvanceHtml, 'arrow-page-advance', !settings.canPageForward, 'advance()') + pagerHtmlEnding;
            }
            if (options.hasMultiplePages) {
                var content = templates.pageToFirstHtml.replace(pager_templates_1.PagerTemplates.PAGE_TO_FIRST_PLACEHOLDER, settings.firstPage.toString());
                pagerHtmlBeginning += this.buildButton(content, 'page-to-beginning', !settings.canPageBackward, 'pageToBeginning()');
                content = templates.pageToLastHtml.replace(pager_templates_1.PagerTemplates.PAGE_TO_LAST_PLACEHOLDER, settings.totalPages.toString());
                pagerHtmlEnding = "" + this.buildButton(content, 'arrow-page-end', !settings.canPageForward, 'pageToEnd()') + pagerHtmlEnding;
            }
            if (settings.hasMorePagesBackward) {
                pagerHtmlBeginning += this.buildButton(templates.pageFillerBeforeHtml, 'page-filler-before');
            }
            if (settings.hasMorePagesForward) {
                pagerHtmlEnding = "" + this.buildButton(templates.pageFillerAfterHtml, 'page-filler-after') + pagerHtmlEnding;
            }
            settings.pagesRange
                .forEach(function (pageRange) {
                var content = templates.pageRangeHtml.replace('${pageRange.displayPage}', pageRange.displayPage);
                pagerHtmlBeginning += _this.buildButton(content, "page-" + pageRange.page, _this.currentPage === pageRange.page, "pageTo(" + pageRange.page + ")");
            });
            if (options.enablePageInput) {
                pagerHtmlEnding += "<input id=\"page-input\" value=\"" + this.currentPage + "\" onblur=\"updateCurrentPage()\" />";
            }
            var element = document.createElement('div');
            element.id = "pager-container" + options.id;
            element.innerHTML = "" + pagerHtmlBeginning + pagerHtmlEnding;
            return element;
        };
        PdPager.prototype.buildButton = function (content, elementId, buttonIsDisabled, onclickAction) {
            if (buttonIsDisabled === void 0) { buttonIsDisabled = true; }
            if (onclickAction === void 0) { onclickAction = ''; }
            var disabledAttribute = 'disabled="disabled"';
            onclickAction = buttonIsDisabled ? '' : "onclick=\"" + onclickAction + "\"";
            return "<button id=\"" + elementId + "\" type=\"button\" " + (buttonIsDisabled ? disabledAttribute : onclickAction) + ">" + content + "</button>";
        };
        return PdPager;
    }());
    exports.PdPager = PdPager;
    function pageToEnd() {
        this.logger.debug('pageToEnd');
        pageTo.call(this, this.settings.totalPages);
    }
    exports.pageToEnd = pageToEnd;
    function pageToBeginning() {
        this.logger.debug('pageToBeginning');
        pageTo.call(this, this.settings.firstPage);
    }
    exports.pageToBeginning = pageToBeginning;
    function retreat() {
        this.logger.debug('retreat');
        if (this.settings.canPageBackward) {
            pageTo.call(this, this.currentPage - 1);
        }
    }
    exports.retreat = retreat;
    function advance() {
        this.logger.debug('advance');
        if (this.currentPage < this.settings.totalPages) {
            pageTo.call(this, this.currentPage + 1);
        }
    }
    exports.advance = advance;
    function pageTo(pageIndex) {
        this.logger.debug('pageTo(' + pageIndex + ')');
        if (pageIndex > 0 && pageIndex <= this.settings.totalPages) {
            this.displayPageInput = this.settings.convertFromDecimal(pageIndex);
        }
    }
    exports.pageTo = pageTo;
    function updateCurrentPage() {
        this.logger.debug('updateCurrentPage');
        var isValidPageInput = pageInputIsValid.call(this);
        if (isValidPageInput) {
            pageTo.call(this, this.settings.convertToDecimal.call(this, this.displayPageInput));
        }
    }
    exports.updateCurrentPage = updateCurrentPage;
    function pageInputIsValid() {
        this.logger.debug('pageInputIsValid');
        var pageInput = this.settings.convertToDecimal(this.displayPageInput);
        return pageInput && !isNaN(pageInput) && pageInput >= 1 && pageInput <= this.settings.totalPages;
    }
});

//# sourceMappingURL=maps/pd-pager2.js.map
