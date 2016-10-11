(function (factory) {
    if (typeof module === 'object' && typeof module.exports === 'object') {
        var v = factory(require, exports); if (v !== undefined) module.exports = v;
    }
    else if (typeof define === 'function' && define.amd) {
        define(["require", "exports", './pager-templates-constants'], factory);
    }
})(function (require, exports) {
    "use strict";
    var pager_templates_constants_1 = require('./pager-templates-constants');
    var Pager = (function () {
        function Pager(options, parentElement, logger) {
            this.noopLogger = { debug: this.noop, error: this.noop, exception: this.noop, info: this.noop, log: this.noop, trace: this.noop, warn: this.noop };
            this.logger = logger || this.noopLogger;
            this.logger.debug('constructor');
            this.options = this.createOptions(options);
            this.currentPage = this.options.firstPage;
            this.updatePagerState(this.options);
            this.parentElement = parentElement || document.body;
            var pager = this.buildPager(this.options);
            this.parentElement.appendChild(pager);
        }
        Pager.prototype.pageTo = function (pageIndex) {
            this.logger.debug('pageTo(' + pageIndex + ')');
            if (pageIndex > 0 && pageIndex <= this.totalNumberOfPages) {
                this.displayPageInput = this.convertFromDecimal(pageIndex);
                this.currentPage = this.displayPageInput;
                this.updatePager();
            }
        };
        Pager.prototype.updatePager = function () {
            this.updatePagerState(this.options);
            var pager = this.buildPager(this.options);
            var currentPagerElement = document.getElementById("pager-container-" + this.id);
            if (currentPagerElement) {
                currentPagerElement.parentElement.replaceChild(pager, currentPagerElement);
            }
            else {
                this.parentElement.appendChild(pager);
            }
            this.parentElement.dispatchEvent(new CustomEvent('page', { detail: { id: this.id, pageToPage: this.currentPage } }));
        };
        Pager.prototype.updateCurrentPage = function () {
            this.logger.debug('updateCurrentPage');
            var isValidPageInput = this.pageInputIsValid();
            var currentPagerElement = document.getElementById("page-input-" + this.id);
            if (isValidPageInput) {
                this.pageTo(this.convertToDecimal.call(this, this.displayPageInput));
                if (currentPagerElement.classList.contains('invalid')) {
                    currentPagerElement.classList.remove('invalid');
                }
            }
            else if (!currentPagerElement.classList.contains('invalid')) {
                currentPagerElement.classList.add('invalid');
            }
        };
        Pager.prototype.pageInputIsValid = function () {
            this.logger.debug('pageInputIsValid');
            var pageInput = this.convertToDecimal(this.displayPageInput);
            return !!pageInput && !isNaN(pageInput) && pageInput >= 1 && pageInput <= this.totalNumberOfPages;
        };
        Object.defineProperty(Pager.prototype, "displayPageInput", {
            get: function () {
                return parseInt(this.input.value, 10);
            },
            set: function (value) {
                if (this.input) {
                    this.input.value = value.toString();
                }
            },
            enumerable: true,
            configurable: true
        });
        Pager.prototype.createOptions = function (options) {
            this.logger.debug('createOptions');
            options = options || {};
            options.firstPage = options.firstPage || 1;
            options.convertFromDecimal = options.convertFromDecimal || this.convertFromDecimal.bind(this);
            options.convertToDecimal = options.convertToDecimal || this.convertToDecimal.bind(this);
            options.totalNumberOfRecords = options.totalNumberOfRecords || 0;
            options.enableFirstLastPageArrows = options.enableFirstLastPageArrows || false;
            options.enablePageArrows = options.enablePageArrows || false;
            options.enablePageInput = options.enablePageInput || false;
            options.maximumNumberOfExplicitPagesToDisplay = Math.max((options.maximumNumberOfExplicitPagesToDisplay || 7), 5);
            options.pageSize = options.pageSize || 10;
            options.id = options.id || Math.floor(Math.random() * 10000).toString();
            return options;
        };
        Pager.prototype.createTemplates = function (templates) {
            this.logger.debug('createTemplates');
            templates = templates || {};
            templates.pageToBeginningHtml = templates.pageToBeginningHtml || pager_templates_constants_1.PagerTemplateConstants.DEFAULT_PAGE_TO_BEGINNING_HTML;
            templates.pageRetreatHtml = templates.pageRangeHtml || pager_templates_constants_1.PagerTemplateConstants.DEFAULT_PAGE_RETREAT_HTML;
            templates.pageToFirstHtml = templates.pageToFirstHtml || pager_templates_constants_1.PagerTemplateConstants.DEFAULT_PAGE_TO_FIRST_HTML;
            templates.pageFillerBeforeHtml = templates.pageFillerBeforeHtml || pager_templates_constants_1.PagerTemplateConstants.DEFAULT_PAGE_FILLER_BEFORE_HTML;
            templates.pageRangeHtml = templates.pageRangeHtml || pager_templates_constants_1.PagerTemplateConstants.DEFAULT_PAGE_RANGE_HTML;
            templates.pageFillerAfterHtml = templates.pageFillerAfterHtml || pager_templates_constants_1.PagerTemplateConstants.DEFAULT_PAGE_FILLER_AFTER_HTML;
            templates.pageToLastHtml = templates.pageToLastHtml || pager_templates_constants_1.PagerTemplateConstants.DEFAULT_PAGE_TO_LAST_HTML;
            templates.pageAdvanceHtml = templates.pageAdvanceHtml || pager_templates_constants_1.PagerTemplateConstants.DEFAULT_PAGE_ADVANCE_HTML;
            templates.pageToEndHtml = templates.pageToEndHtml || pager_templates_constants_1.PagerTemplateConstants.DEFAULT_PAGE_TO_END_HTML;
            return templates;
        };
        Pager.prototype.convertFromDecimal = function (decimalNumeralRepresentation) {
            this.logger.debug('convertFromDecimal(' + decimalNumeralRepresentation + ')');
            return decimalNumeralRepresentation;
        };
        Pager.prototype.convertToDecimal = function (alternativeNumeralRepresentation) {
            this.logger.debug('convertToDecimal(' + alternativeNumeralRepresentation + ')');
            return parseInt(alternativeNumeralRepresentation, 10);
        };
        Pager.prototype.noop = function () {
        };
        Pager.prototype.updatePagerState = function (options) {
            this.logger.debug('updatePagerState');
            this.totalNumberOfPages = options.pageSize && options.totalNumberOfRecords ? options.totalNumberOfRecords / options.pageSize : 0;
            this.id = options.id;
            this.convertFromDecimal = options.convertFromDecimal.bind(this);
            this.convertToDecimal = options.convertToDecimal.bind(this);
            this.maximumNumberOfExplicitPagesToDisplay = options.maximumNumberOfExplicitPagesToDisplay;
            this.canPageBackward = this.currentPage > options.firstPage;
            this.canPageForward = this.currentPage < this.totalNumberOfPages;
            this.hasMorePagesBackward = false;
            this.hasMorePagesForward = false;
            if (this.currentPage > options.firstPage + 2
                && this.totalNumberOfPages > this.maximumNumberOfExplicitPagesToDisplay) {
                this.hasMorePagesBackward = true;
            }
            if (this.currentPage < this.totalNumberOfPages - 2
                && this.totalNumberOfPages > this.maximumNumberOfExplicitPagesToDisplay) {
                this.hasMorePagesForward = true;
            }
            var rangeStart;
            var rangeEnd;
            if (!this.hasMorePagesBackward && !this.hasMorePagesForward) {
                rangeStart = options.firstPage + 1;
                rangeEnd = this.totalNumberOfPages;
            }
            else if (!this.hasMorePagesBackward) {
                rangeStart = options.firstPage + 1;
                rangeEnd = this.maximumNumberOfExplicitPagesToDisplay - 1;
            }
            else if (!this.hasMorePagesForward) {
                rangeEnd = this.totalNumberOfPages;
                rangeStart = this.totalNumberOfPages - this.maximumNumberOfExplicitPagesToDisplay + 3;
            }
            else {
                var hasOddNumberOfButtons = (this.maximumNumberOfExplicitPagesToDisplay % 2) === 1;
                var x = Math.ceil((this.maximumNumberOfExplicitPagesToDisplay - 5) / 2);
                if (this.currentPage + x === this.totalNumberOfPages - 2) {
                    this.hasMorePagesForward = false;
                    rangeStart = this.currentPage - x;
                    rangeEnd = this.totalNumberOfPages;
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
            this.pagesRange = [];
            for (; rangeStart < rangeEnd; rangeStart++) {
                this.pagesRange.push({ displayPage: options.convertFromDecimal(rangeStart), page: rangeStart });
            }
        };
        Pager.prototype.buildPager = function (options) {
            var _this = this;
            var templates = this.createTemplates(options.templates);
            var beginningPagerButtons = [];
            var endingPagerButtons = [];
            var hasMultiplePages = this.totalNumberOfPages > options.firstPage;
            var displayFirstPage = options.convertFromDecimal(options.firstPage);
            var lastPage = options.convertFromDecimal(this.totalNumberOfPages);
            if (options.enableFirstLastPageArrows) {
                beginningPagerButtons.push(this.buildButton(templates.pageToBeginningHtml, 'arrow-page-to-beginning', !this.canPageBackward, this.pageTo.bind(this, options.firstPage)));
                endingPagerButtons.unshift(this.buildButton(templates.pageToEndHtml, 'arrow-page-to-end', !this.canPageForward, this.pageTo.bind(this, this.totalNumberOfPages)));
            }
            if (options.enablePageArrows) {
                beginningPagerButtons.push(this.buildButton(templates.pageRetreatHtml, 'arrow-page-retreat', !this.canPageBackward, this.pageTo.bind(this, this.currentPage - 1)));
                endingPagerButtons.unshift(this.buildButton(templates.pageAdvanceHtml, 'arrow-page-advance', !this.canPageForward, this.pageTo.bind(this, this.currentPage + 1)));
            }
            if (hasMultiplePages) {
                var content = templates.pageToFirstHtml.replace(pager_templates_constants_1.PagerTemplateConstants.PAGE_TO_FIRST_PLACEHOLDER, displayFirstPage.toString());
                beginningPagerButtons.push(this.buildButton(content, 'page-to-beginning', !this.canPageBackward, this.pageTo.bind(this, options.firstPage)));
                content = templates.pageToLastHtml.replace(pager_templates_constants_1.PagerTemplateConstants.PAGE_TO_LAST_PLACEHOLDER, lastPage.toString());
                endingPagerButtons.unshift(this.buildButton(content, 'arrow-page-end', !this.canPageForward, this.pageTo.bind(this, this.totalNumberOfPages)));
            }
            if (this.hasMorePagesBackward) {
                beginningPagerButtons.push(this.buildButton(templates.pageFillerBeforeHtml, 'page-filler-before'));
            }
            if (this.hasMorePagesForward) {
                endingPagerButtons.unshift(this.buildButton(templates.pageFillerAfterHtml, 'page-filler-after'));
            }
            this.pagesRange
                .forEach(function (pageRange) {
                var content = templates.pageRangeHtml.replace(pager_templates_constants_1.PagerTemplateConstants.PAGE_RANGE_PLACEHOLDER, pageRange.displayPage);
                beginningPagerButtons.push(_this.buildButton(content, "page-" + pageRange.page, _this.currentPage === pageRange.page, _this.pageTo.bind(_this, pageRange.page)));
            });
            if (options.enablePageInput) {
                var input = document.createElement('input');
                input.id = "page-input-" + this.id;
                input.value = this.currentPage.toString();
                input.addEventListener('blur', this.updateCurrentPage.bind(this), false);
                this.input = input;
                endingPagerButtons.push(input);
            }
            var element = document.createElement('div');
            element.id = "pager-container-" + this.id;
            beginningPagerButtons
                .concat(endingPagerButtons)
                .forEach(function (button) {
                element.appendChild(button);
            });
            return element;
        };
        Pager.prototype.buildButton = function (content, elementId, buttonIsDisabled, onclickAction) {
            if (buttonIsDisabled === void 0) { buttonIsDisabled = true; }
            if (onclickAction === void 0) { onclickAction = null; }
            var button = document.createElement('button');
            button.id = elementId;
            if (buttonIsDisabled) {
                button.disabled = true;
            }
            if (onclickAction) {
                button.addEventListener('click', onclickAction, false);
            }
            button.innerHTML = content;
            return button;
        };
        return Pager;
    }());
    exports.Pager = Pager;
});

//# sourceMappingURL=maps/pager.js.map
