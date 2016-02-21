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

  @LoggingDecorators.timePromise
  asyncMethod<T>(foo?: T): Promise<T> {
    let p = new Promise<T>((resolve, reject) => {
      if (!foo) return reject(new Error('No foo'));
      this.timeMethod();
      resolve(foo);
    });

    return p;
  }
}
let a = [1, 3, 5];
let b = [0, ...a, 2, 4];

let test = new TestClass();
console.log('foo');
test.timeMethod();
console.log('bar');
test.infoMethod();
test.traceMethod();
test.logger.level = LogLevels.DEBUG;
test.infoMethod();
test.timeMethod();
test.traceMethod();
test.profileMethod();
(async function () {
  console.log(await test.asyncMethod('foo'));
  console.log('bar');
  try {
    await test.asyncMethod();
  } catch (err) {
    console.log(err);
  }
})();
console.log('baz');
test.logger.info(test, ...b);

