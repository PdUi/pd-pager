interface ILogger {
    debug(message?: string, ...optionalParams: any[]): void;
    error(message?: any, ...optionalParams: any[]): void;
    exception(message?: string, ...optionalParams: any[]): void;
    info(message?: any, ...optionalParams: any[]): void;
    log(message?: any, ...optionalParams: any[]): void;
    trace(message?: any, ...optionalParams: any[]): void;
    warn(message?: any, ...optionalParams: any[]): void;
}
