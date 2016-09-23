import {ILogger} from './ilogger';

export class PdPagerOptions {
  public convertFromDecimal: (decimalNumeralRepresentation: number) => any;
  public convertToDecimal: (alternativeNumeralRepresentation: any) => number;
  public totalNumberOfRecords: number = 0;
  public id: string;

  public get firstPage(): number {
    this.logger.debug('get:firstPage');
    return this._firstPage;
  }

  public get hasMultiplePages(): boolean {
    this.logger.debug('get:hasMultiplePages');
    return this.totalPages > this.firstPage;
  }

  public get totalPages(): number {
    this.logger.debug('get:totalPages');
    return this.pageSize && this.totalNumberOfRecords ? this.totalNumberOfRecords / this.pageSize : 0;
  }

  public get enableFirstLastPageArrows(): boolean {
    this.logger.debug('get:enableFirstLastPageArrows');
    return this.enablePageArrows && this._enableFirstLastPageArrows;
  }

  public set enableFirstLastPageArrows(enableFirstLastPageArrows: boolean) {
    this.logger.debug('set:enableFirstLastPageArrows = ' + enableFirstLastPageArrows);
    this._enableFirstLastPageArrows = enableFirstLastPageArrows;
  }

  public get enablePageArrows(): boolean {
    this.logger.debug('get:enablePageArrows');
    return this._enablePageArrows && this.hasMultiplePages;
  }

  public set enablePageArrows(enablePageArrows: boolean) {
    this.logger.debug('set:enablePageArrows = ' + enablePageArrows);
    this._enablePageArrows = enablePageArrows;
  }

  public get enablePageInput(): boolean {
    this.logger.debug('get:enablePageInput');
    return this._enablePageInput && this.hasMultiplePages;
  }

  public set enablePageInput(enablePageInput: boolean) {
    this.logger.debug('set:enablePageInput = ' + enablePageInput);
    this._enablePageInput = enablePageInput;
  }

  public get maximumNumberOfExplicitPagesToDisplay(): number {
    this.logger.debug('get:maximumNumberOfExplicitPagesToDisplay');
    return this._maximumNumberOfExplicitPagesToDisplay;
  }

  public set maximumNumberOfExplicitPagesToDisplay(maximumNumberOfExplicitPagesToDisplay: number) {
    this.logger.debug('set:maximumNumberOfExplicitPagesToDisplay = ' + maximumNumberOfExplicitPagesToDisplay);
    this._maximumNumberOfExplicitPagesToDisplay = Math.max((maximumNumberOfExplicitPagesToDisplay || 7), 5);
  }

  public get pageSize(): number {
    this.logger.debug('get:pageSize');
    return this._pageSize;
  }

  public set pageSize(pageSize: number) {
    this.logger.debug('set:pageSize');
    this._pageSize = pageSize;
  }

  private _enableFirstLastPageArrows: boolean = false;
  private _enablePageArrows: boolean = false;
  private _enablePageInput: boolean = false;
  private _firstPage: number = 1;
  private _maximumNumberOfExplicitPagesToDisplay: number = 7;
  private _pageSize: number = 10;

  public constructor(options?: PdPagerOptions, private logger?: ILogger) {
    this.logger = logger || console;

    this.logger.debug('constructor');
    this.convertFromDecimal = options.convertFromDecimal || this._convertFromDecimal;
    this.convertToDecimal = options.convertToDecimal || this._convertToDecimal;
    this.totalNumberOfRecords = options.totalNumberOfRecords || this.totalNumberOfRecords;
    this.enableFirstLastPageArrows = options.enableFirstLastPageArrows || this.enableFirstLastPageArrows;
    this.enablePageArrows = options.enablePageArrows || this.enablePageArrows;
    this.enablePageInput = options.enablePageInput || this.enablePageInput;
    this.maximumNumberOfExplicitPagesToDisplay = options.maximumNumberOfExplicitPagesToDisplay
                                                    || this.maximumNumberOfExplicitPagesToDisplay;
    this.pageSize = options.pageSize || this.pageSize;
    this.id = options.id || Math.floor(Math.random() * 10000).toString();
    // this.convertFromDecimal = this._convertFromDecimal;
    // this.convertToDecimal = this._convertToDecimal;
    // this.totalNumberOfRecords = 0;
    // this.enableFirstLastPageArrows = false;
    // this.enablePageArrows = false;
    // this.enablePageInput = false;
    // this.maximumNumberOfExplicitPagesToDisplay = 7;
    // this.pageSize = 10;
  }

  // public update(options: any): PdPagerOptions {
  //   this.logger.info('update(' + JSON.stringify(options) + ')');
  //   this.convertFromDecimal = options.convertFromDecimal || this._convertFromDecimal;
  //   this.convertToDecimal = options.convertToDecimal || this._convertToDecimal;
  //   this.totalNumberOfRecords = options.totalNumberOfRecords || this.totalNumberOfRecords;
  //   this.enableFirstLastPageArrows = options.enableFirstLastPageArrows || this.enableFirstLastPageArrows;
  //   this.enablePageArrows = options.enablePageArrows || this.enablePageArrows;
  //   this.enablePageInput = options.enablePageInput || this.enablePageInput;
  //   this.maximumNumberOfExplicitPagesToDisplay = options.maxmimumNumberOfExplicitPagesToDisplay
  //                                                   || this.maximumNumberOfExplicitPagesToDisplay;
  //   this.pageSize = options.pageSize || this.pageSize;
  //   this.id = options.id || this.id;

  //   return this;
  // }

  private _convertToDecimal(alternativeNumeralRepresentation) {
    this.logger.debug('_convertToDecimal(' + alternativeNumeralRepresentation + ')');
    return parseInt(alternativeNumeralRepresentation, 10);
  }

  private _convertFromDecimal(decimalNumeralRepresentation) {
    this.logger.debug('_convertFromDecimal(' + decimalNumeralRepresentation + ')');
    return decimalNumeralRepresentation;
  }
}
