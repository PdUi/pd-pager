import {Page} from './page';

export class PagerSettings {
    public firstPage: number;
    public maximumNumberOfExplicitPagesToDisplay: number;
    public totalPages: number;
    public canPageBackward: boolean;
    public canPageForward: boolean;
    public hasMorePagesBackward: boolean;
    public hasMorePagesForward: boolean;
    public pagesRange: Page[];
    public convertFromDecimal: (decimalNumeralRepresentation: number) => any;
    public convertToDecimal: (alternativeNumeralRepresentation: any) => number;
}
