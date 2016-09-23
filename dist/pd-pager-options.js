define(["require", "exports"], function (require, exports) {
    "use strict";
    var PdPagerOptions = (function () {
        function PdPagerOptions(options, logger) {
            this.logger = logger;
            this.totalNumberOfRecords = 0;
            this._enableFirstLastPageArrows = false;
            this._enablePageArrows = false;
            this._enablePageInput = false;
            this._firstPage = 1;
            this._maximumNumberOfExplicitPagesToDisplay = 7;
            this._pageSize = 10;
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
        }
        Object.defineProperty(PdPagerOptions.prototype, "firstPage", {
            get: function () {
                this.logger.debug('get:firstPage');
                return this._firstPage;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PdPagerOptions.prototype, "hasMultiplePages", {
            get: function () {
                this.logger.debug('get:hasMultiplePages');
                return this.totalPages > this.firstPage;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PdPagerOptions.prototype, "totalPages", {
            get: function () {
                this.logger.debug('get:totalPages');
                return this.pageSize && this.totalNumberOfRecords ? this.totalNumberOfRecords / this.pageSize : 0;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PdPagerOptions.prototype, "enableFirstLastPageArrows", {
            get: function () {
                this.logger.debug('get:enableFirstLastPageArrows');
                return this.enablePageArrows && this._enableFirstLastPageArrows;
            },
            set: function (enableFirstLastPageArrows) {
                this.logger.debug('set:enableFirstLastPageArrows = ' + enableFirstLastPageArrows);
                this._enableFirstLastPageArrows = enableFirstLastPageArrows;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PdPagerOptions.prototype, "enablePageArrows", {
            get: function () {
                this.logger.debug('get:enablePageArrows');
                return this._enablePageArrows && this.hasMultiplePages;
            },
            set: function (enablePageArrows) {
                this.logger.debug('set:enablePageArrows = ' + enablePageArrows);
                this._enablePageArrows = enablePageArrows;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PdPagerOptions.prototype, "enablePageInput", {
            get: function () {
                this.logger.debug('get:enablePageInput');
                return this._enablePageInput && this.hasMultiplePages;
            },
            set: function (enablePageInput) {
                this.logger.debug('set:enablePageInput = ' + enablePageInput);
                this._enablePageInput = enablePageInput;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PdPagerOptions.prototype, "maximumNumberOfExplicitPagesToDisplay", {
            get: function () {
                this.logger.debug('get:maximumNumberOfExplicitPagesToDisplay');
                return this._maximumNumberOfExplicitPagesToDisplay;
            },
            set: function (maximumNumberOfExplicitPagesToDisplay) {
                this.logger.debug('set:maximumNumberOfExplicitPagesToDisplay = ' + maximumNumberOfExplicitPagesToDisplay);
                this._maximumNumberOfExplicitPagesToDisplay = Math.max((maximumNumberOfExplicitPagesToDisplay || 7), 5);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PdPagerOptions.prototype, "pageSize", {
            get: function () {
                this.logger.debug('get:pageSize');
                return this._pageSize;
            },
            set: function (pageSize) {
                this.logger.debug('set:pageSize');
                this._pageSize = pageSize;
            },
            enumerable: true,
            configurable: true
        });
        PdPagerOptions.prototype._convertToDecimal = function (alternativeNumeralRepresentation) {
            this.logger.debug('_convertToDecimal(' + alternativeNumeralRepresentation + ')');
            return parseInt(alternativeNumeralRepresentation, 10);
        };
        PdPagerOptions.prototype._convertFromDecimal = function (decimalNumeralRepresentation) {
            this.logger.debug('_convertFromDecimal(' + decimalNumeralRepresentation + ')');
            return decimalNumeralRepresentation;
        };
        return PdPagerOptions;
    }());
    exports.PdPagerOptions = PdPagerOptions;
});

//# sourceMappingURL=maps/pd-pager-options.js.map
