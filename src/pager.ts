class Pager {
    public canPageBackward: boolean;
    public canPageForward: boolean;
    public currentPage: number;
    public hasMorePagesBackward: boolean;
    public hasMorePagesForward: boolean;
    public id: string;
    public input: HTMLInputElement;
    public logger: ILogger;
    public maximumNumberOfExplicitPagesToDisplay: number;
    public pagesRange: IPagerExplicitPage[];
    public totalNumberOfPages: number;

    private noopLogger: ILogger = { debug: this.noop, error: this.noop, exception: this.noop, info: this.noop, log: this.noop, trace: this.noop, warn: this.noop };
    private parentElement: HTMLElement;
    private options: IPagerOptions;

    public constructor(options?: IPagerOptions, parentElement?: HTMLElement, logger?: ILogger) {
       this.logger = logger || this.noopLogger;
       this.logger.debug('constructor');

       this.options = this.createOptions(options);

       this.currentPage = options.firstPage;
       this.updatePagerState(this.options);

       this.parentElement = parentElement || document.body;

       let pager = this.buildPager(this.options);
       this.parentElement.appendChild(pager);
    }

    private pageTo(pageIndex: number): void {
        this.logger.debug('pageTo(' + pageIndex + ')');

        if (pageIndex > 0 && pageIndex <= this.totalNumberOfPages) {
            this.displayPageInput = this.convertFromDecimal(pageIndex);
            this.currentPage = this.displayPageInput;
            this.updatePager();
        }
    }

    private updatePager() {
        this.updatePagerState(this.options);
        let pager = this.buildPager(this.options);

        let currentPagerElement = document.getElementById(`pager-container-${this.id}`);
        if (currentPagerElement) {
            currentPagerElement.parentElement.replaceChild(pager, currentPagerElement);
        } else {
            this.parentElement.appendChild(pager);
        }
    }

    private updateCurrentPage(): void {
        this.logger.debug('updateCurrentPage');
        let isValidPageInput = this.pageInputIsValid();
        let currentPagerElement = document.getElementById(`page-input-${this.id}`);

        if (isValidPageInput) {
            this.pageTo(this.convertToDecimal.call(this, this.displayPageInput));

            if (currentPagerElement.classList.contains('invalid')) {
                currentPagerElement.classList.remove('invalid');
            }
        } else if (!currentPagerElement.classList.contains('invalid')) {
            currentPagerElement.classList.add('invalid');
        }
    }

    private pageInputIsValid(): boolean {
        this.logger.debug('pageInputIsValid');
        let pageInput = this.convertToDecimal(this.displayPageInput);

        return !!pageInput && !isNaN(pageInput) && pageInput >= 1 && pageInput <= this.totalNumberOfPages;
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

        return options;
    }

    private createTemplates(templates?: IPagerTemplates): IPagerTemplates {
        this.logger.debug('createTemplates');

        templates = templates || <IPagerTemplates> {};
        templates.pageToBeginningHtml = templates.pageToBeginningHtml || PagerTemplateConstants.DEFAULT_PAGE_TO_BEGINNING_HTML;
        templates.pageRetreatHtml = templates.pageRangeHtml || PagerTemplateConstants.DEFAULT_PAGE_RETREAT_HTML;
        templates.pageToFirstHtml = templates.pageToFirstHtml || PagerTemplateConstants.DEFAULT_PAGE_TO_FIRST_HTML;
        templates.pageFillerBeforeHtml = templates.pageFillerBeforeHtml || PagerTemplateConstants.DEFAULT_PAGE_FILLER_BEFORE_HTML;
        templates.pageRangeHtml = templates.pageRangeHtml || PagerTemplateConstants.DEFAULT_PAGE_RANGE_HTML;
        templates.pageFillerAfterHtml = templates.pageFillerAfterHtml || PagerTemplateConstants.DEFAULT_PAGE_FILLER_AFTER_HTML;
        templates.pageToLastHtml = templates.pageToLastHtml || PagerTemplateConstants.DEFAULT_PAGE_TO_LAST_HTML;
        templates.pageAdvanceHtml = templates.pageAdvanceHtml || PagerTemplateConstants.DEFAULT_PAGE_ADVANCE_HTML;
        templates.pageToEndHtml = templates.pageToEndHtml || PagerTemplateConstants.DEFAULT_PAGE_TO_END_HTML;

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

    /* JUSTIFICATION: default logger won't do anything */
    /* tslint:disable-next-line:no-empty */
    private noop(): void {
    }

    private updatePagerState(options: IPagerOptions): void {
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

        let rangeStart;
        let rangeEnd;
        if (!this.hasMorePagesBackward && !this.hasMorePagesForward) {
            rangeStart = options.firstPage + 1;
            rangeEnd = this.totalNumberOfPages;
        } else if (!this.hasMorePagesBackward) {
            rangeStart = options.firstPage + 1;
            rangeEnd = this.maximumNumberOfExplicitPagesToDisplay - 1;
        } else if (!this.hasMorePagesForward) {
            rangeEnd = this.totalNumberOfPages;
            rangeStart = this.totalNumberOfPages - this.maximumNumberOfExplicitPagesToDisplay + 3;
        } else {
            let hasOddNumberOfButtons = (this.maximumNumberOfExplicitPagesToDisplay % 2) === 1;
            let x = Math.ceil((this.maximumNumberOfExplicitPagesToDisplay - 5) / 2);

            if (this.currentPage + x === this.totalNumberOfPages - 2) {
                this.hasMorePagesForward = false;
                rangeStart = this.currentPage - x;
                rangeEnd = this.totalNumberOfPages;
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
        let displayFirstPage = options.convertFromDecimal(options.firstPage);
        let lastPage = options.convertFromDecimal(this.totalNumberOfPages);

        if (options.enableFirstLastPageArrows) {
            beginningPagerButtons.push(this.buildButton(templates.pageToBeginningHtml, 'arrow-page-to-beginning', !this.canPageBackward, this.pageTo.bind(this, options.firstPage)));
            endingPagerButtons.unshift(this.buildButton(templates.pageToEndHtml, 'arrow-page-to-end', !this.canPageForward, this.pageTo.bind(this, this.totalNumberOfPages)));
        }

        if (options.enablePageArrows) {
            beginningPagerButtons.push(this.buildButton(templates.pageRetreatHtml, 'arrow-page-retreat', !this.canPageBackward, this.pageTo.bind(this, this.currentPage - 1)));
            endingPagerButtons.unshift(this.buildButton(templates.pageAdvanceHtml, 'arrow-page-advance', !this.canPageForward, this.pageTo.bind(this, this.currentPage + 1)));
        }

        if (hasMultiplePages) {
            let content = templates.pageToFirstHtml.replace(PagerTemplateConstants.PAGE_TO_FIRST_PLACEHOLDER, displayFirstPage.toString());
            beginningPagerButtons.push(this.buildButton(content, 'page-to-beginning', !this.canPageBackward, this.pageTo.bind(this, options.firstPage)));

            content = templates.pageToLastHtml.replace(PagerTemplateConstants.PAGE_TO_LAST_PLACEHOLDER, lastPage.toString());
            endingPagerButtons.unshift(this.buildButton(content, 'arrow-page-end', !this.canPageForward, this.pageTo.bind(this, this.totalNumberOfPages)));
        }

        if (this.hasMorePagesBackward) {
            beginningPagerButtons.push(this.buildButton(templates.pageFillerBeforeHtml, 'page-filler-before'));
        }

        if (this.hasMorePagesForward) {
            endingPagerButtons.unshift(this.buildButton(templates.pageFillerAfterHtml, 'page-filler-after'));
        }

        this.pagesRange
                .forEach(pageRange => {
                    let content = templates.pageRangeHtml.replace(PagerTemplateConstants.PAGE_RANGE_PLACEHOLDER, pageRange.displayPage);
                    beginningPagerButtons.push(this.buildButton(content, `page-${pageRange.page}`, this.currentPage === pageRange.page, this.pageTo.bind(this, pageRange.page)));
                });

        if (options.enablePageInput) {
            let input = document.createElement('input');
            input.id = `page-input-${this.id}`;
            input.value = this.currentPage.toString();
            input.addEventListener('blur', this.updateCurrentPage.bind(this), false);
            this.input = input;
            endingPagerButtons.push(input);
        }

        let element = document.createElement('div');
        element.id = `pager-container-${this.id}`;

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
