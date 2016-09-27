class Pager {
    private canPageBackward: boolean;
    private canPageForward: boolean;
    private currentPage: number;
    private firstPage: number;
    private hasMorePagesBackward: boolean;
    private hasMorePagesForward: boolean;
    private id: string;
    private input: HTMLInputElement;
    private logger: ILogger;
    private maximumNumberOfExplicitPagesToDisplay: number;
    private pagesRange: IPagerExplicitPage[];
    private totalNumberOfPages: number;
    private totalPages: number;

    public constructor(options?: IPagerOptions, parentElement?: HTMLElement, logger?: ILogger) {
       this.logger = this.logger || console;
       this.logger.debug('constructor');

       options = this.createOptions(options);

       this.buildSettings(options);

       parentElement = parentElement || document.body;

       let pagerHtml = this.buildPager(options);
       parentElement.appendChild(pagerHtml);
    }

    private pageToEnd(): void {
        this.logger.debug('pageToEnd');
        this.pageTo(this.totalPages);
    }

    private pageToBeginning(): void {
        this.logger.debug('pageToBeginning');
        this.pageTo(this.firstPage);
    }

    private retreat(): void {
        this.logger.debug('retreat');
        if (this.canPageBackward) {
            this.pageTo(this.currentPage - 1);
        }
    }

    private advance(): void {
        this.logger.debug('advance');
        if (this.canPageForward) {
            this.pageTo(this.currentPage + 1);
        }
    }

    private pageTo(pageIndex: number): void {
        this.logger.debug('pageTo(' + pageIndex + ')');
        if (pageIndex > 0 && pageIndex <= this.totalPages) {
            this.displayPageInput = this.convertFromDecimal(pageIndex);
    //            this.updateState();
        }
    }

    private updateCurrentPage(): void {
        this.logger.debug('updateCurrentPage');
        let isValidPageInput = this.pageInputIsValid();

        if (isValidPageInput) {
            this.pageTo(this.convertToDecimal.call(this, this.displayPageInput));
        }
    }

    private pageInputIsValid(): boolean {
        this.logger.debug('pageInputIsValid');
        let pageInput = this.convertToDecimal(this.displayPageInput);

        return pageInput && !isNaN(pageInput) && pageInput >= 1 && pageInput <= this.totalPages;
    }

    private get displayPageInput() {
        return parseInt(this.input.value, 10);
    }

    private set displayPageInput(value: number) {
        if (this.input) {
            this.input.value = value.toString();
        }
    }

    private createOptions(options?: IPagerOptions): IPagerOptions {
        this.logger.debug('createOptions');

        options = options || <IPagerOptions> {};
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

        this.totalNumberOfPages = options.pageSize && options.totalNumberOfRecords ? options.totalNumberOfRecords / options.pageSize : 0;

        return options;
    }

    private createTemplates(templates?: IPagerTemplates): IPagerTemplates {
        this.logger.debug('createTemplates');

        templates = templates || <IPagerTemplates> {};
        templates.pageToBeginningHtml = templates.pageToBeginningHtml || '|<';
        templates.pageRetreatHtml = templates.pageRangeHtml || '<';
        templates.pageToFirstHtml = templates.pageToFirstHtml || '${settings.firstPage}';
        templates.pageFillerBeforeHtml = templates.pageFillerBeforeHtml || '...';
        templates.pageRangeHtml = templates.pageRangeHtml || '${pageRange.displayPage}';
        templates.pageFillerAfterHtml = templates.pageFillerAfterHtml || '...';
        templates.pageToLastHtml = templates.pageToLastHtml || '${settings.totalPages}';
        templates.pageAdvanceHtml = templates.pageAdvanceHtml || '>';
        templates.pageToEndHtml = templates.pageToEndHtml || '>|';

        return templates;
    }

    private convertFromDecimal(decimalNumeralRepresentation: number): any {
        this.logger.debug('convertFromDecimal(' + decimalNumeralRepresentation + ')');
        return decimalNumeralRepresentation;
    }

    private convertToDecimal(alternativeNumeralRepresentation: any): number {
        this.logger.debug('convertToDecimal(' + alternativeNumeralRepresentation + ')');
        return parseInt(alternativeNumeralRepresentation, 10);
    }

    private buildSettings(options: IPagerOptions): void {
        this.logger.debug('buildSettings');
        let firstPage = options.convertFromDecimal(options.firstPage);
        this.currentPage = firstPage;
        this.id = options.id;
        this.convertFromDecimal = options.convertFromDecimal.bind(this);
        this.convertToDecimal = options.convertToDecimal.bind(this);
        this.firstPage = options.convertFromDecimal(options.firstPage);
        this.maximumNumberOfExplicitPagesToDisplay = options.maximumNumberOfExplicitPagesToDisplay;
        this.totalPages = options.convertFromDecimal(this.totalNumberOfPages);

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

    private buildPager(options: IPagerOptions): HTMLElement {
        let templates = this.createTemplates(options.templates);
        let beginningPagerButtons = [];
        let endingPagerButtons = [];
        let hasMultiplePages = this.totalNumberOfPages > options.firstPage;

        if (options.enableFirstLastPageArrows) {
            beginningPagerButtons.push(this.buildButton(templates.pageToBeginningHtml, 'arrow-page-to-beginning', !this.canPageBackward, this.pageToBeginning.bind(this)));
            endingPagerButtons.unshift(this.buildButton(templates.pageToEndHtml, 'arrow-page-to-end', !this.canPageForward, this.pageToEnd.bind(this)));
        }

        if (options.enablePageArrows) {
            beginningPagerButtons.push(this.buildButton(templates.pageRetreatHtml, 'arrow-page-retreat', !this.canPageBackward, this.retreat.bind(this)));
            endingPagerButtons.unshift(this.buildButton(templates.pageAdvanceHtml, 'arrow-page-advance', !this.canPageForward, this.advance.bind(this)));
        }

        if (hasMultiplePages) {
            let content = templates.pageToFirstHtml.replace('${settings.firstPage}', this.firstPage.toString());
            beginningPagerButtons.push(this.buildButton(content, 'page-to-beginning', !this.canPageBackward, this.pageToBeginning.bind(this)));

            content = templates.pageToLastHtml.replace('${settings.totalPages}', this.totalPages.toString());
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

interface IPagerExplicitPage {
    displayPage: any;
    page: number;
}
