(function (factory) {
    if (typeof module === 'object' && typeof module.exports === 'object') {
        var v = factory(require, exports); if (v !== undefined) module.exports = v;
    }
    else if (typeof define === 'function' && define.amd) {
        define(["require", "exports"], factory);
    }
})(function (require, exports) {
    "use strict";
    var PagerTemplateConstants = (function () {
        function PagerTemplateConstants() {
        }
        PagerTemplateConstants.PAGE_TO_FIRST_PLACEHOLDER = '${settings.firstPage}';
        PagerTemplateConstants.PAGE_TO_LAST_PLACEHOLDER = '${settings.lastPage}';
        PagerTemplateConstants.PAGE_RANGE_PLACEHOLDER = '${pageRange.displayPage}';
        PagerTemplateConstants.DEFAULT_PAGE_TO_BEGINNING_HTML = '|<';
        PagerTemplateConstants.DEFAULT_PAGE_TO_END_HTML = '>|';
        PagerTemplateConstants.DEFAULT_PAGE_RETREAT_HTML = '<';
        PagerTemplateConstants.DEFAULT_PAGE_ADVANCE_HTML = '>';
        PagerTemplateConstants.DEFAULT_PAGE_TO_FIRST_HTML = PagerTemplateConstants.PAGE_TO_FIRST_PLACEHOLDER;
        PagerTemplateConstants.DEFAULT_PAGE_TO_LAST_HTML = PagerTemplateConstants.PAGE_TO_LAST_PLACEHOLDER;
        PagerTemplateConstants.DEFAULT_PAGE_FILLER_BEFORE_HTML = '...';
        PagerTemplateConstants.DEFAULT_PAGE_FILLER_AFTER_HTML = '...';
        PagerTemplateConstants.DEFAULT_PAGE_RANGE_HTML = PagerTemplateConstants.PAGE_RANGE_PLACEHOLDER;
        return PagerTemplateConstants;
    }());
    exports.PagerTemplateConstants = PagerTemplateConstants;
});

//# sourceMappingURL=maps/pager-templates-constants.js.map
