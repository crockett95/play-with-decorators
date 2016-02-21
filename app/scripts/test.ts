import { Logger, LogLevels, LoggingDecorators } from './logger';
import { deprecatedProp as deprecated } from './main';

class TestClass {
  public logger: Logger = new Logger(LogLevels.INFO);

  @LoggingDecorators.trace
  traceMethod() {
    return false;
  }

  @deprecated('Don\'t use this')
  @LoggingDecorators.time
  timeMethod() {
    let time = Date.now();

    while (Date.now() - time < 1000) {
      let x = 4;
    }
  }

  infoMethod() {
    this.logger.info('foo');
  }

  @LoggingDecorators.profile
  profileMethod() {
    for (let i = 0; i < 10; ++i) {
      this.timeMethod();
    }
  }
}

let test = new TestClass();
test.timeMethod();
test.infoMethod();
test.traceMethod();
test.logger.level = LogLevels.DEBUG;
test.infoMethod();
test.timeMethod();
test.traceMethod();
test.profileMethod();
