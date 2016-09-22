export class PagerTemplates {
    public static PAGE_TO_FIRST_PLACEHOLDER: string = '${settings.firstPage}';
    public static PAGE_TO_LAST_PLACEHOLDER: string = '${settings.totalPages}';
    public static PAGE_RANGE_PLACEHOLDER: string = '${pageRange.displayPage}';
    public pageToBeginningHtml: string = '|<';
    public pageToEndHtml: string = '>|';
    public pageRetreatHtml: string = '<';
    public pageAdvanceHtml: string = '>';
    public pageToFirstHtml: string = PagerTemplates.PAGE_TO_FIRST_PLACEHOLDER;
    public pageToLastHtml: string = PagerTemplates.PAGE_TO_LAST_PLACEHOLDER;
    public pageFillerBeforeHtml: string = '...';
    public pageFillerAfterHtml: string = '...';
    public pageRangeHtml: string = PagerTemplates.PAGE_RANGE_PLACEHOLDER;
}
