import { Logger, LogLevels, LoggingDecorators } from './logger';
import { deprecatedProp as deprecated } from './main';

class TestClass {
  public logger: Logger = new Logger(/*LogLevels.INFO*/);

  @LoggingDecorators.trace
  traceMethod() {
    return false;
  }

  @deprecated()
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

  asyncMethod = async function (foo: any) {
    return new Promise((resolve) => {
      this.timeMethod();
      resolve(foo);
    });
  }
}

let test = new TestClass();
test.timeMethod();
test.infoMethod();
test.traceMethod();
// test.logger.level = LogLevels.DEBUG;
test.infoMethod();
test.timeMethod();
test.traceMethod();
test.profileMethod();
(async function () {
  console.log(await test.asyncMethod('foo'));
  console.log('bar');
})();
console.log('baz');

