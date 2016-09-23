define(["require", "exports", './pager-settings', './pager-templates', './pd-pager-options'], function (require, exports, pager_settings_1, pager_templates_1, pd_pager_options_1) {
    "use strict";
    var PdPager = (function () {
        function PdPager(options, parentElement, logger) {
            this.logger = logger;
            parentElement = parentElement || document.body;
            this.logger = this.logger || console;
            options = new pd_pager_options_1.PdPagerOptions(options);
            this.logger.info('constructor');
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
        PdPager.prototype.pageTo = function (pageIndex) {
            this.logger.info('pageTo(' + pageIndex + ')');
            if (pageIndex > 0 && pageIndex <= this.settings.totalPages) {
                this.displayPageInput = this.settings.convertFromDecimal(pageIndex);
            }
        };
        PdPager.prototype.pageToBeginning = function () {
            this.logger.info('pageToBeginning');
            this.pageTo(this.settings.firstPage);
        };
        PdPager.prototype.retreat = function () {
            this.logger.info('retreat');
            if (this.settings.canPageBackward) {
                this.pageTo(this.currentPage - 1);
            }
        };
        PdPager.prototype.advance = function () {
            this.logger.info('advance');
            if (this.currentPage < this.settings.totalPages) {
                this.pageTo(this.currentPage + 1);
            }
        };
        PdPager.prototype.pageToEnd = function () {
            this.logger.info('pageToEnd');
            this.pageTo(this.settings.totalPages);
        };
        PdPager.prototype.updateCurrentPage = function () {
            this.logger.info('updateCurrentPage');
            var isValidPageInput = this.pageInputIsValid();
            if (isValidPageInput) {
                this.pageTo(this.settings.convertToDecimal(this.displayPageInput));
            }
        };
        PdPager.prototype.pageInputIsValid = function () {
            this.logger.info('pageInputIsValid');
            var pageInput = this.settings.convertToDecimal(this.displayPageInput);
            return pageInput && !isNaN(pageInput) && pageInput >= 1 && pageInput <= this.settings.totalPages;
        };
        PdPager.prototype.buildSettings = function (options) {
            this.logger.info('buildSettings');
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
            var disabledAttribute = ' disabled="disabled"';
            if (options.enableFirstLastPageArrows) {
                pagerHtmlBeginning += "<button id=\"arrow-page-to-beginning\"\n                                           type=\"button\"\n                                           " + (settings.canPageBackward ? '' : disabledAttribute) + "\n                                           onclick=\"pageToBeginning()\">\n                                        " + templates.pageToBeginningHtml + "\n                                    </button>";
                pagerHtmlEnding = "<button id=\"arrow-page-to-end\"\n                                       type=\"button\"\n                                       " + (settings.canPageForward ? '' : disabledAttribute) + "\n                                       onclick=\"pageToEnd()\">\n                                    " + templates.pageToEndHtml + "\n                               </button>\n                               " + pagerHtmlEnding;
            }
            if (options.enablePageArrows) {
                pagerHtmlBeginning += "<button id=\"arrow-page-retreat\"\n                                           type=\"button\"\n                                           " + (settings.canPageBackward ? '' : disabledAttribute) + "\n                                           onclick=\"retreat()\">\n                                        " + templates.pageRetreatHtml + "\n                                   </button>";
                pagerHtmlEnding = "<button id=\"arrow-page-advance\"\n                                       type=\"button\"\n                                       " + (settings.canPageForward ? '' : disabledAttribute) + "\n                                       onclick=\"advance()\">\n                                    " + templates.pageAdvanceHtml + "\n                               </button>\n                               " + pagerHtmlEnding;
            }
            if (options.hasMultiplePages) {
                pagerHtmlBeginning += "<button id=\"page-to-beginning\"\n                                           type=\"button\"\n                                           " + (settings.canPageBackward ? '' : disabledAttribute) + "\n                                           onclick=\"pageToBeginning()\">\n                                        " + templates.pageToFirstHtml + "\n                                    </button>";
                pagerHtmlEnding = "<button id=\"page-to-end\"\n                                       type=\"button\"\n                                       " + (settings.canPageForward ? '' : disabledAttribute) + "\n                                       onclick=\"pageToEnd()\">\n                                    " + templates.pageToLastHtml + "\n                                </button>\n                                " + pagerHtmlEnding;
            }
            if (settings.hasMorePagesBackward) {
                pagerHtmlBeginning += "<button id=\"page-filler-before\"\n                                           type=\"button\"\n                                           " + disabledAttribute + ">\n                                        " + templates.pageFillerBeforeHtml + "\n                                    </button>";
            }
            if (settings.hasMorePagesForward) {
                pagerHtmlEnding = "<button id=\"page-filler-after\"\n                                       type=\"button\"\n                                       " + disabledAttribute + ">\n                                    " + templates.pageFillerAfterHtml + "\n                                </button>\n                                " + pagerHtmlEnding;
            }
            settings.pagesRange
                .forEach(function (pageRange) {
                var content = templates.pageRangeHtml.replace('${pageRange.displayPage}', pageRange.displayPage);
                pagerHtmlBeginning += "<button id=\"page-" + pageRange.page + "\"\n                                                   type=\"button\"\n                                                   " + (_this.currentPage !== pageRange.page ? '' : disabledAttribute) + "\n                                                   onclick=\"pageTo(" + pageRange.page + ")\">\n                                                " + content + "\n                                            </button>";
            });
            if (options.enablePageInput) {
                pagerHtmlEnding += "<input id=\"page-input\"\n                                        type=\"button\"\n                                        value=\"" + this.currentPage + "\"\n                                        onblur=\"updateCurrentPage()\"\n                                />";
            }
            var element = document.createElement('div');
            element.id = "pager-containter" + options.id;
            element.innerHTML = "" + pagerHtmlBeginning + pagerHtmlEnding;
            return element;
        };
        return PdPager;
    }());
    exports.PdPager = PdPager;
});

//# sourceMappingURL=maps/pd-pager1.js.map
