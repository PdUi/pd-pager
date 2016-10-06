System.register([], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var PagerTemplateConstants;
    return {
        setters:[],
        execute: function() {
            PagerTemplateConstants = (function () {
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
            exports_1("PagerTemplateConstants", PagerTemplateConstants);
        }
    }
});

//# sourceMappingURL=maps/pager-templates-constants.js.map
