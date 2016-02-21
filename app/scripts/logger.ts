import { deprecatedProp as deprecated } from './main';

export class Logger implements Console {
  private static _g: Logger;

  constructor(public level: LogLevels = LogLevels.WARN) {}

  /**
   * Foo bar baz
   *
   * @param {string} method [description]
   * @param {any[]}  args   [description]
   */
  nativeCall(level: LogMethodLevels, method: string, args: any[]|IArguments): void {
    if ((this.level & level) && console && (<any>console)[method]) {
      (<any>console)[method].apply(console, args);
    }
  }

  error(...args: any[]): void {
    this.nativeCall(LogMethodLevels.ERROR, 'error', args);
  }

  trace(...args: any[]): void {
    this.nativeCall(LogMethodLevels.DEBUG, 'trace', arguments);
  }

  assert(test: boolean, message?: string, ...args: any[]): void {
    this.nativeCall(LogMethodLevels.ERROR, 'assert', arguments);
  }

  count(name?: string): void {
    this.nativeCall(LogMethodLevels.LOG, 'count', arguments);
    console.time
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

  clear: () => void;
  msIsIndependentlyComposed: () => boolean;

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
    name: string|symbol,
    properties?: PropertyDescriptor
  ) => {
    var origFn = properties.value;
    properties.value = function () {
      (<Loggable>this).logger.trace(`${(<any>target.constructor).name}#${name.toString()}`);
      let retVal = origFn.apply(this, arguments);
      return retVal;
    }
  }

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
    }
  }

  export var timePromise: PropertyDecorator = (
    target: Object,
    name: string|symbol,
    properties?: PropertyDescriptor
  ) => {
    var origFn = properties.value;
    properties.value = function () {
      let ts = performance.now();
      (<Loggable>this).logger.time(`${(<any>target.constructor).name}#${name.toString()} (${ts})`);
      return origFn.apply(this, arguments).then((val: any) => {
        (<Loggable>this).logger.timeEnd(`${(<any>target.constructor).name}#${name.toString()} (${ts})`);
        return val;
      }, (val: any) => {
        (<Loggable>this).logger.timeEnd(`${(<any>target.constructor).name}#${name.toString()} (${ts})`);
        throw val;
      });
    }
  }

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
    }
  }
}
