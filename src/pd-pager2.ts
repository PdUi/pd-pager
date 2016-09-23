import {ILogger} from './ilogger';
import {PagerSettings} from './pager-settings';
import {PagerTemplates} from './pager-templates';
import {PdPagerOptions} from './pd-pager-options';

export class PdPager {
    private currentPage: number;
    private settings: PagerSettings;

    public constructor(options?: PdPagerOptions, parentElement?: Element, private logger?: ILogger) {
       parentElement = parentElement || document.body;
       this.logger = this.logger || console;
       options = new PdPagerOptions(options);

       this.logger.debug('constructor');
       let firstPage = options.convertFromDecimal(options.firstPage);
       this.currentPage = firstPage;
       let settings = this.buildSettings(options);
       let pagerHtml = this.buildPager(options, settings);
       parentElement.appendChild(pagerHtml);
    }

    private get displayPageInput(): number {
        return parseInt((<HTMLInputElement> document.getElementById('page-input')).value, 10);
    }

    private set displayPageInput(value: number) {
        let inputElement = <HTMLInputElement> document.getElementById('page-input');
        if (inputElement) {
            inputElement.value = value.toString();
        }
    }

    private buildSettings(options: PdPagerOptions): PagerSettings {
        this.logger.debug('buildSettings');
        let settings = new PagerSettings();
        settings.convertFromDecimal = options.convertFromDecimal.bind(this);
        settings.convertToDecimal = options.convertToDecimal.bind(this);
        settings.firstPage = options.convertFromDecimal(options.firstPage);
        settings.maximumNumberOfExplicitPagesToDisplay = options.maximumNumberOfExplicitPagesToDisplay;
        settings.totalPages = options.convertFromDecimal(options.totalPages);

        settings.canPageBackward = this.currentPage > settings.firstPage;
        settings.canPageForward = this.currentPage < settings.totalPages;

        settings.hasMorePagesBackward = false;
        settings.hasMorePagesForward = false;

        if (this.currentPage > settings.firstPage + 2
            && settings.totalPages > settings.maximumNumberOfExplicitPagesToDisplay) {
            settings.hasMorePagesBackward = true;
        }

        if (this.currentPage < settings.totalPages - 2
            && settings.totalPages > settings.maximumNumberOfExplicitPagesToDisplay) {
            settings.hasMorePagesForward = true;
        }

        let rangeStart;
        let rangeEnd;
        if (!settings.hasMorePagesBackward && !settings.hasMorePagesForward) {
            rangeStart = settings.firstPage + 1;
            rangeEnd = settings.totalPages;
        } else if (!settings.hasMorePagesBackward) {
            rangeStart = settings.firstPage + 1;
            rangeEnd = settings.maximumNumberOfExplicitPagesToDisplay - 1;
        } else if (!settings.hasMorePagesForward) {
            rangeEnd = settings.totalPages;
            rangeStart = settings.totalPages - settings.maximumNumberOfExplicitPagesToDisplay + 3;
        } else {
            let hasOddNumberOfButtons = (settings.maximumNumberOfExplicitPagesToDisplay % 2) === 1;
            let x = Math.ceil((settings.maximumNumberOfExplicitPagesToDisplay - 5) / 2);

            if (this.currentPage + x === settings.totalPages - 2) {
                settings.hasMorePagesForward = false;
                rangeStart = this.currentPage - x;
                rangeEnd = settings.totalPages;
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

        settings.pagesRange = [];
        for (; rangeStart < rangeEnd; rangeStart++) {
            settings.pagesRange.push({displayPage: options.convertFromDecimal(rangeStart), page: rangeStart });
        }

        this.settings = settings;
        return settings;
    }

    private buildPager(options: PdPagerOptions, settings: PagerSettings): HTMLDivElement {
        let templates = new PagerTemplates();
        let pagerHtmlBeginning: string = '';
        let pagerHtmlEnding: string = '';

        if (options.enableFirstLastPageArrows) {
            pagerHtmlBeginning += this.buildButton(templates.pageToBeginningHtml, 'arrow-page-to-beginning', !settings.canPageBackward, 'pageToBeginning()');
            pagerHtmlEnding = `${this.buildButton(templates.pageToEndHtml, 'arrow-page-to-end', !settings.canPageForward, 'pageToEnd()')}${pagerHtmlEnding}`;
        }

        if (options.enablePageArrows) {
            pagerHtmlBeginning += this.buildButton(templates.pageRetreatHtml, 'arrow-page-retreat', !settings.canPageBackward, 'retreat()');
            pagerHtmlEnding = `${this.buildButton(templates.pageAdvanceHtml, 'arrow-page-advance', !settings.canPageForward, 'advance()')}${pagerHtmlEnding}`;
        }

        if (options.hasMultiplePages) {
            let content = templates.pageToFirstHtml.replace(PagerTemplates.PAGE_TO_FIRST_PLACEHOLDER, settings.firstPage.toString());
            pagerHtmlBeginning += this.buildButton(content, 'page-to-beginning', !settings.canPageBackward, 'pageToBeginning()');

            content = templates.pageToLastHtml.replace(PagerTemplates.PAGE_TO_LAST_PLACEHOLDER, settings.totalPages.toString());
            pagerHtmlEnding = `${this.buildButton(content, 'arrow-page-end', !settings.canPageForward, 'pageToEnd()')}${pagerHtmlEnding}`;
        }

        if (settings.hasMorePagesBackward) {
            pagerHtmlBeginning += this.buildButton(templates.pageFillerBeforeHtml, 'page-filler-before');
        }

        if (settings.hasMorePagesForward) {
            pagerHtmlEnding = `${this.buildButton(templates.pageFillerAfterHtml, 'page-filler-after')}${pagerHtmlEnding}`;
        }

        settings.pagesRange
                .forEach(pageRange => {
                    let content = templates.pageRangeHtml.replace('${pageRange.displayPage}', pageRange.displayPage);
                    pagerHtmlBeginning += this.buildButton(content, `page-${pageRange.page}`, this.currentPage === pageRange.page, `pageTo(${pageRange.page})`);
                });

        if (options.enablePageInput) {
            pagerHtmlEnding += `<input id="page-input" value="${this.currentPage}" onblur="updateCurrentPage()" />`;
        }

        let element = document.createElement('div');
        element.id = `pager-container${options.id}`;
        element.innerHTML = `${pagerHtmlBeginning}${pagerHtmlEnding}`;
        return element;
    }

    private buildButton(content: string, elementId: string, buttonIsDisabled: boolean = true, onclickAction: string = ''): string {
        let disabledAttribute = 'disabled="disabled"';
        onclickAction = buttonIsDisabled ? '' : `onclick="${onclickAction}"`;

        return `<button id="${elementId}" type="button" ${buttonIsDisabled ? disabledAttribute : onclickAction}>${content}</button>`;
    }
}

export function pageToEnd(): void {
    this.logger.debug('pageToEnd');
    pageTo.call(this, this.settings.totalPages);
}

export function pageToBeginning(): void {
    this.logger.debug('pageToBeginning');
    pageTo.call(this, this.settings.firstPage);
}

export function retreat(): void {
    this.logger.debug('retreat');
    if (this.settings.canPageBackward) {
        pageTo.call(this, this.currentPage - 1);
    }
}

export function advance(): void {
    this.logger.debug('advance');
    if (this.currentPage < this.settings.totalPages) {
        pageTo.call(this, this.currentPage + 1);
    }
}

export function pageTo(pageIndex: number): void {
    this.logger.debug('pageTo(' + pageIndex + ')');
    if (pageIndex > 0 && pageIndex <= this.settings.totalPages) {
        this.displayPageInput = this.settings.convertFromDecimal(pageIndex);
//            this.updateState();
    }
}

export function updateCurrentPage() {
    this.logger.debug('updateCurrentPage');
    let isValidPageInput = pageInputIsValid.call(this);

    if (isValidPageInput) {
        pageTo.call(this, this.settings.convertToDecimal.call(this, this.displayPageInput));
    }
}

function pageInputIsValid(): boolean {
    this.logger.debug('pageInputIsValid');
    let pageInput = this.settings.convertToDecimal(this.displayPageInput);

    return pageInput && !isNaN(pageInput) && pageInput >= 1 && pageInput <= this.settings.totalPages;
}
