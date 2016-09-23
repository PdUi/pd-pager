import {PagerSettings} from './pager-settings';
import {PagerTemplates} from './pager-templates';
import {PdPagerOptions} from './pd-pager-options';

export class PdPager {
    private currentPage: number;
    private settings: PagerSettings;

    public constructor(options?: PdPagerOptions, parentElement?: Element, private logger?: any) {
       parentElement = parentElement || document.body;
       this.logger = this.logger || console;
       options = new PdPagerOptions(options);

       this.logger.info('constructor');
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

    public pageTo(pageIndex: number) {
        this.logger.info('pageTo(' + pageIndex + ')');
        if (pageIndex > 0 && pageIndex <= this.settings.totalPages) {
            this.displayPageInput = this.settings.convertFromDecimal(pageIndex);
//            this.updateState();
        }
    }

    public pageToBeginning() {
      this.logger.info('pageToBeginning');
      this.pageTo(this.settings.firstPage);
    }

    public retreat() {
      this.logger.info('retreat');
      if (this.settings.canPageBackward) {
        this.pageTo(this.currentPage - 1);
      }
    }

    public advance() {
      this.logger.info('advance');
      if (this.currentPage < this.settings.totalPages) {
        this.pageTo(this.currentPage + 1);
      }
    }

    public pageToEnd() {
      this.logger.info('pageToEnd');
      this.pageTo(this.settings.totalPages);
    }

    public updateCurrentPage() {
        this.logger.info('updateCurrentPage');
        let isValidPageInput = this.pageInputIsValid();

        if (isValidPageInput) {
            this.pageTo(this.settings.convertToDecimal(this.displayPageInput));
        }
    }

    private pageInputIsValid(): boolean {
        this.logger.info('pageInputIsValid');
        let pageInput = this.settings.convertToDecimal(this.displayPageInput);

        return pageInput && !isNaN(pageInput) && pageInput >= 1 && pageInput <= this.settings.totalPages;
    }

    private buildSettings(options: PdPagerOptions): PagerSettings {
        this.logger.info('buildSettings');
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
        let disabledAttribute: string = ' disabled="disabled"';

        if (options.enableFirstLastPageArrows) {
            pagerHtmlBeginning += `<button id="arrow-page-to-beginning"
                                           type="button"
                                           ${settings.canPageBackward ? '' : disabledAttribute}
                                           onclick="pageToBeginning()">
                                        ${templates.pageToBeginningHtml}
                                    </button>`;

            pagerHtmlEnding = `<button id="arrow-page-to-end"
                                       type="button"
                                       ${settings.canPageForward ? '' : disabledAttribute}
                                       onclick="pageToEnd()">
                                    ${templates.pageToEndHtml}
                               </button>
                               ${pagerHtmlEnding}`;
        }

        if (options.enablePageArrows) {
            pagerHtmlBeginning += `<button id="arrow-page-retreat"
                                           type="button"
                                           ${settings.canPageBackward ? '' : disabledAttribute}
                                           onclick="retreat()">
                                        ${templates.pageRetreatHtml}
                                   </button>`;

            pagerHtmlEnding = `<button id="arrow-page-advance"
                                       type="button"
                                       ${settings.canPageForward ? '' : disabledAttribute}
                                       onclick="advance()">
                                    ${templates.pageAdvanceHtml}
                               </button>
                               ${pagerHtmlEnding}`;
        }

        if (options.hasMultiplePages) {
            pagerHtmlBeginning += `<button id="page-to-beginning"
                                           type="button"
                                           ${settings.canPageBackward ? '' : disabledAttribute}
                                           onclick="pageToBeginning()">
                                        ${templates.pageToFirstHtml}
                                    </button>`;

            pagerHtmlEnding = `<button id="page-to-end"
                                       type="button"
                                       ${settings.canPageForward ? '' : disabledAttribute}
                                       onclick="pageToEnd()">
                                    ${templates.pageToLastHtml}
                                </button>
                                ${pagerHtmlEnding}`;
        }

        if (settings.hasMorePagesBackward) {
            pagerHtmlBeginning += `<button id="page-filler-before"
                                           type="button"
                                           ${disabledAttribute}>
                                        ${templates.pageFillerBeforeHtml}
                                    </button>`;
        }

        if (settings.hasMorePagesForward) {
            pagerHtmlEnding = `<button id="page-filler-after"
                                       type="button"
                                       ${disabledAttribute}>
                                    ${templates.pageFillerAfterHtml}
                                </button>
                                ${pagerHtmlEnding}`;
        }

        settings.pagesRange
                .forEach(pageRange => {
                    let content = templates.pageRangeHtml.replace('${pageRange.displayPage}', pageRange.displayPage);
                    pagerHtmlBeginning += `<button id="page-${pageRange.page}"
                                                   type="button"
                                                   ${this.currentPage !== pageRange.page ? '' : disabledAttribute}
                                                   onclick="pageTo(${pageRange.page})">
                                                ${content}
                                            </button>`;
                });

        if (options.enablePageInput) {
            pagerHtmlEnding += `<input id="page-input"
                                        type="button"
                                        value="${this.currentPage}"
                                        onblur="updateCurrentPage()"
                                />`;
        }

        let element = document.createElement('div');
        element.id = `pager-containter${options.id}`;
        element.innerHTML = `${pagerHtmlBeginning}${pagerHtmlEnding}`;
        return element;
    }
}
