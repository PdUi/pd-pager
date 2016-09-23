import {ILogger} from './ilogger';
import {Page} from './page';
import {PagerTemplates} from './pager-templates';
import {PdPagerOptions} from './pd-pager-options';

export class PdPager {
    private currentPage: number;
    private id: string;
    private firstPage: number;
    private maximumNumberOfExplicitPagesToDisplay: number;
    private totalPages: number;
    private canPageBackward: boolean;
    private canPageForward: boolean;
    private hasMorePagesBackward: boolean;
    private hasMorePagesForward: boolean;
    private pagesRange: Page[];
    private convertFromDecimal: (decimalNumeralRepresentation: number) => any;
    private convertToDecimal: (alternativeNumeralRepresentation: any) => number;
    private input: HTMLInputElement;

    public constructor(options?: PdPagerOptions, parentElement?: Element, private logger?: ILogger) {
       parentElement = parentElement || document.body;
       this.logger = this.logger || console;
       options = new PdPagerOptions(options);

       this.logger.debug('constructor');
       let firstPage = options.convertFromDecimal(options.firstPage);
       this.currentPage = firstPage;
       this.buildSettings(options);
       let pagerHtml = this.buildPager(options);
       parentElement.appendChild(pagerHtml);
    }

    public pageToEnd(): void {
        this.logger.debug('pageToEnd');
        this.pageTo(this.totalPages);
    }

    public pageToBeginning(): void {
        this.logger.debug('pageToBeginning');
        this.pageTo(this.firstPage);
    }

    public retreat(): void {
        this.logger.debug('retreat');
        if (this.canPageBackward) {
            this.pageTo(this.currentPage - 1);
        }
    }

    public advance(): void {
        this.logger.debug('advance');
        if (this.currentPage < this.totalPages) {
            this.pageTo(this.currentPage + 1);
        }
    }

    public pageTo(pageIndex: number): void {
        this.logger.debug('pageTo(' + pageIndex + ')');
        if (pageIndex > 0 && pageIndex <= this.totalPages) {
            this.displayPageInput = this.convertFromDecimal(pageIndex);
    //            this.updateState();
        }
    }

    public updateCurrentPage() {
        this.logger.debug('updateCurrentPage');
        let isValidPageInput = this.pageInputIsValid();

        if (isValidPageInput) {
            this.pageTo(this.convertToDecimal.call(this, this.displayPageInput));
        }
    }

    public pageInputIsValid(): boolean {
        this.logger.debug('pageInputIsValid');
        let pageInput = this.convertToDecimal(this.displayPageInput);

        return pageInput && !isNaN(pageInput) && pageInput >= 1 && pageInput <= this.totalPages;
    }

    private get displayPageInput(): number {
        return parseInt(this.input.value, 10);
    }

    private set displayPageInput(value: number) {
        if (this.input) {
            this.input.value = value.toString();
        }
    }

    private buildSettings(options: PdPagerOptions): void {
        this.logger.debug('buildSettings');
        this.id = options.id;
        this.convertFromDecimal = options.convertFromDecimal.bind(this);
        this.convertToDecimal = options.convertToDecimal.bind(this);
        this.firstPage = options.convertFromDecimal(options.firstPage);
        this.maximumNumberOfExplicitPagesToDisplay = options.maximumNumberOfExplicitPagesToDisplay;
        this.totalPages = options.convertFromDecimal(options.totalPages);

        this.canPageBackward = this.currentPage > this.firstPage;
        this.canPageForward = this.currentPage < this.totalPages;

        this.hasMorePagesBackward = false;
        this.hasMorePagesForward = false;

        if (this.currentPage > this.firstPage + 2
            && this.totalPages > this.maximumNumberOfExplicitPagesToDisplay) {
            this.hasMorePagesBackward = true;
        }

        if (this.currentPage < this.totalPages - 2
            && this.totalPages > this.maximumNumberOfExplicitPagesToDisplay) {
            this.hasMorePagesForward = true;
        }

        let rangeStart;
        let rangeEnd;
        if (!this.hasMorePagesBackward && !this.hasMorePagesForward) {
            rangeStart = this.firstPage + 1;
            rangeEnd = this.totalPages;
        } else if (!this.hasMorePagesBackward) {
            rangeStart = this.firstPage + 1;
            rangeEnd = this.maximumNumberOfExplicitPagesToDisplay - 1;
        } else if (!this.hasMorePagesForward) {
            rangeEnd = this.totalPages;
            rangeStart = this.totalPages - this.maximumNumberOfExplicitPagesToDisplay + 3;
        } else {
            let hasOddNumberOfButtons = (this.maximumNumberOfExplicitPagesToDisplay % 2) === 1;
            let x = Math.ceil((this.maximumNumberOfExplicitPagesToDisplay - 5) / 2);

            if (this.currentPage + x === this.totalPages - 2) {
                this.hasMorePagesForward = false;
                rangeStart = this.currentPage - x;
                rangeEnd = this.totalPages;
            } else {
                if (hasOddNumberOfButtons) {
                    rangeStart = this.currentPage - x;
                    rangeEnd = this.currentPage + x + 1;
                } else {
                    rangeStart = this.currentPage - x + 1;
                    rangeEnd = this.currentPage + x + 1;
                }
            }
        }

        this.pagesRange = [];
        for (; rangeStart < rangeEnd; rangeStart++) {
            this.pagesRange.push({displayPage: options.convertFromDecimal(rangeStart), page: rangeStart });
        }
    }

    private buildPager(options: PdPagerOptions): HTMLDivElement {
        let templates = new PagerTemplates();
        let beginningPagerButtons: HTMLElement[] = [];
        let endingPagerButtons: HTMLElement[] = [];

        if (options.enableFirstLastPageArrows) {
            beginningPagerButtons.push(this.buildButton(templates.pageToBeginningHtml, 'arrow-page-to-beginning', !this.canPageBackward, this.pageToBeginning.bind(this)));
            endingPagerButtons.unshift(this.buildButton(templates.pageToEndHtml, 'arrow-page-to-end', !this.canPageForward, this.pageToEnd.bind(this)));
        }

        if (options.enablePageArrows) {
            beginningPagerButtons.push(this.buildButton(templates.pageRetreatHtml, 'arrow-page-retreat', !this.canPageBackward, this.retreat.bind(this)));
            endingPagerButtons.unshift(this.buildButton(templates.pageAdvanceHtml, 'arrow-page-advance', !this.canPageForward, this.advance.bind(this)));
        }

        if (options.hasMultiplePages) {
            let content = templates.pageToFirstHtml.replace(PagerTemplates.PAGE_TO_FIRST_PLACEHOLDER, this.firstPage.toString());
            beginningPagerButtons.push(this.buildButton(content, 'page-to-beginning', !this.canPageBackward, this.pageToBeginning.bind(this)));

            content = templates.pageToLastHtml.replace(PagerTemplates.PAGE_TO_LAST_PLACEHOLDER, this.totalPages.toString());
            endingPagerButtons.unshift(this.buildButton(content, 'arrow-page-end', !this.canPageForward, this.pageToEnd.bind(this)));
        }

        if (this.hasMorePagesBackward) {
            beginningPagerButtons.push(this.buildButton(templates.pageFillerBeforeHtml, 'page-filler-before'));
        }

        if (this.hasMorePagesForward) {
            endingPagerButtons.unshift(this.buildButton(templates.pageFillerAfterHtml, 'page-filler-after'));
        }

        this.pagesRange
                .forEach(pageRange => {
                    let content = templates.pageRangeHtml.replace('${pageRange.displayPage}', pageRange.displayPage);
                    beginningPagerButtons.push(this.buildButton(content, `page-${pageRange.page}`, this.currentPage === pageRange.page, this.pageTo.bind(this, pageRange.page)));
                });

        if (options.enablePageInput) {
            let input = document.createElement('input');
            input.id = `page-input-${this.id}`;
            input.value = this.currentPage.toString();
            input.blur = this.updateCurrentPage;
            this.input = input;
            endingPagerButtons.push(input);
        }

        let element = document.createElement('div');
        element.id = `pager-container${this.id}`;

        beginningPagerButtons
            .concat(endingPagerButtons)
            .forEach(button => {
                element.appendChild(button);
            });

        return element;
    }

    private buildButton(content: string, elementId: string, buttonIsDisabled: boolean = true, onclickAction: () => void = null): HTMLButtonElement {
        let button = document.createElement('button');
        button.id = elementId;

        if (buttonIsDisabled) {
            button.disabled = true;
        }

        if (onclickAction) {
            button.addEventListener('click', onclickAction, false);
        }

        button.innerHTML = content;
        return button;
    }
}
