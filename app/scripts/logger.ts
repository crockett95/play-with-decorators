export class Logger implements Console {
  private static _g: Logger;

  msIsIndependentlyComposed: () => boolean;

  constructor(public level: LogLevels = LogLevels.WARN) {}

  clear(): void {
    this.nativeCall(LogMethodLevels.DEBUG, 'clear', arguments);
  }

  error(...args: any[]): void {
    this.nativeCall(LogMethodLevels.ERROR, 'error', arguments);
  }

  trace(...args: any[]): void {
    this.nativeCall(LogMethodLevels.DEBUG, 'trace', arguments);
  }

  assert(test: boolean, message?: string, ...args: any[]): void {
    this.nativeCall(LogMethodLevels.ERROR, 'assert', arguments);
  }

  count(name?: string): void {
    this.nativeCall(LogMethodLevels.LOG, 'count', arguments);
  }

  debug(message?: string, ...args: any[]): void {
    this.nativeCall(LogMethodLevels.DEBUG, 'debug', arguments);
  }

  dir(value?: any, ...args: any[]): void {
    this.nativeCall(LogMethodLevels.DEBUG, 'dir', arguments);
  }

  dirxml(value?: any): void {
    this.nativeCall(LogMethodLevels.DEBUG, 'dirxml', arguments);
  }

  group(...args: any[]): void {
    this.nativeCall(LogMethodLevels.LOG, 'group', arguments);
  }

  groupCollapsed(...args: any[]): void {
    this.nativeCall(LogMethodLevels.LOG, 'groupCollapsed', arguments);
  }

  groupEnd(): void {
    this.nativeCall(LogMethodLevels.LOG, 'groupEnd', arguments);
  }

  info(...args: any[]): void {
    this.nativeCall(LogMethodLevels.INFO, 'info', arguments);
  }

  log(...args: any[]): void {
    this.nativeCall(LogMethodLevels.LOG, 'log', arguments);
  }

  profile(name?: string): void {
    this.nativeCall(LogMethodLevels.DEBUG, 'profile', arguments);
  }

  profileEnd(name?: string): void {
    this.nativeCall(LogMethodLevels.DEBUG, 'profileEnd', arguments);
  }

  select(element: Element): void {
    this.nativeCall(LogMethodLevels.DEBUG, 'select', arguments);
  }

  time(timerName?: string): void {
    this.nativeCall(LogMethodLevels.DEBUG, 'time', arguments);
  }

  timeEnd(timerName?: string): void {
    this.nativeCall(LogMethodLevels.DEBUG, 'timeEnd', arguments);
  }

  warn(...args: any[]): void {
    this.nativeCall(LogMethodLevels.WARN, 'warn', arguments);
  }

  /**
   * Makes a call to the native console method
   *
   * If the instance log level is set low enough, and the console method exists,
   * calls the method on the browser console
   *
   * @param {LogMethodLevels}  level  The required logging level
   * @param {string}           method The method name
   * @param {any[]|IArguments} args   Pass through for the args
   */
  private nativeCall(level: LogMethodLevels, method: string, args: any[] | IArguments): void {
    /* tslint:disable:no-bitwise */
    if ((this.level & level) && console && (<any>console)[method]) {
      /* tslint:enable:no-bitwise */
      (<any>console)[method](...args);
    }
  }

  static get logger(): Logger {
    Logger._g = Logger._g || new Logger();

    return Logger._g;
  }
}

enum LogMethodLevels {
  ERROR = 1,
  WARN = 2,
  INFO = 4,
  LOG = 8,
  DEBUG = 16
}

export enum LogLevels {
  NONE = 0,
  ERROR = 1,
  WARN = 3,
  INFO = 7,
  LOG = 15,
  DEBUG = 31
}

export interface Loggable {
  logger: Logger;
}

export module LoggingDecorators {

  export var trace: PropertyDecorator = (
    target: Object,
    name: string | symbol,
    properties?: PropertyDescriptor
  ) => {
    var origFn = properties.value;
    properties.value = function() {
      (<Loggable>this).logger.trace(`${(<any>target.constructor).name}#${name.toString()}`);
      let retVal = origFn.apply(this, arguments);
      return retVal;
    };
  };

  export var time: PropertyDecorator = (
    target: Object,
    name: string | symbol,
    properties?: PropertyDescriptor
  ) => {
    var origFn = properties.value;
    properties.value = function() {
      (<Loggable>this).logger.time(`${(<any>target.constructor).name}#${name.toString()}`);
      let retVal = origFn.apply(this, arguments);
      (<Loggable>this).logger.timeEnd(`${(<any>target.constructor).name}#${name.toString()}`);
      return retVal;
    };
  };

  export var timePromise: PropertyDecorator = (
    target: Object,
    name: string | symbol,
    properties?: PropertyDescriptor
  ) => {
    var origFn = properties.value;
    properties.value = function() {
      let ts = performance.now();
      (<Loggable>this).logger.time(`${(<any>target.constructor).name}#${name.toString()} (${ts})`);
      return origFn.apply(this, arguments).then((val: any) => {
        (<Loggable>this).logger.timeEnd(`${(<any>target.constructor).name}#${name.toString()} (${ts})`);
        return val;
      }, (val: any) => {
        (<Loggable>this).logger.timeEnd(`${(<any>target.constructor).name}#${name.toString()} (${ts})`);
        throw val;
      });
    };
  };

  export var profile: PropertyDecorator = (
    target: Object,
    name: string | symbol,
    properties?: PropertyDescriptor
  ) => {
    var origFn = properties.value;
    properties.value = function() {
      (<Loggable>this).logger.profile(`${(<any>target.constructor).name}#${name.toString()}`);
      let retVal = origFn.apply(this, arguments);
      (<Loggable>this).logger.profileEnd(`${(<any>target.constructor).name}#${name.toString()}`);
      return retVal;
    };
  };
}
