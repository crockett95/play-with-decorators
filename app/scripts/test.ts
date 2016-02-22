import { Logger, LogLevels, LoggingDecorators } from './logger';
import { deprecatedProp as deprecated } from './main';

class TestClass {
  public logger: Logger = new Logger(/*LogLevels.INFO*/);

  @LoggingDecorators.trace
  traceMethod() {
    return false;
  }

  @deprecated({ removalVersion: '1.0.0' })
  @LoggingDecorators.time
  timeMethod(): number {
    var x: number;
    let time = Date.now();

    while (Date.now() - time < 1000) {
      x = 4;
    }

    return x;
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
      if (!foo) {
        return reject(new Error('No foo'));
      }
      this.timeMethod();
      resolve(foo);
    });

    return p;
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
  try {
    await test.asyncMethod();
  } catch (err) {
    console.log(err);
  }
})();
console.log('baz');

