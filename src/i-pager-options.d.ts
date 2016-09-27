interface IPagerOptions {
    enableFirstLastPageArrows: boolean;
    enablePageArrows: boolean;
    enablePageInput: boolean;
    firstPage: number;
    id: string;
    maximumNumberOfExplicitPagesToDisplay: number;
    pageSize: number;
    templates: IPagerTemplates;
    totalNumberOfRecords: number;

    convertFromDecimal(decimalNumeralRepresentation: number): any;
    convertToDecimal(alternativeNumeralRepresentation: any): number;
}
