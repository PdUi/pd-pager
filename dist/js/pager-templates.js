define(["require", "exports"], function (require, exports) {
    "use strict";
    var PagerTemplates = (function () {
        function PagerTemplates() {
            this.pageToBeginningHtml = '|<';
            this.pageToEndHtml = '>|';
            this.pageRetreatHtml = '<';
            this.pageAdvanceHtml = '>';
            this.pageToFirstHtml = PagerTemplates.PAGE_TO_FIRST_PLACEHOLDER;
            this.pageToLastHtml = PagerTemplates.PAGE_TO_LAST_PLACEHOLDER;
            this.pageFillerBeforeHtml = '...';
            this.pageFillerAfterHtml = '...';
            this.pageRangeHtml = PagerTemplates.PAGE_RANGE_PLACEHOLDER;
        }
        PagerTemplates.PAGE_TO_FIRST_PLACEHOLDER = '${settings.firstPage}';
        PagerTemplates.PAGE_TO_LAST_PLACEHOLDER = '${settings.totalPages}';
        PagerTemplates.PAGE_RANGE_PLACEHOLDER = '${pageRange.displayPage}';
        return PagerTemplates;
    }());
    exports.PagerTemplates = PagerTemplates;
});

//# sourceMappingURL=maps/pager-templates.js.map
