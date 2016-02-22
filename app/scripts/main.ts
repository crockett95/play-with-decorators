export interface DeprecatedOptions {
  infoUrl?: string;
  removalVersion?: string;
  className?: string;
  additionalArgs?: any[];
}

export function deprecatedProp(): PropertyDecorator;
export function deprecatedProp(options: DeprecatedOptions): PropertyDecorator;
export function deprecatedProp(message: string): PropertyDecorator;
export function deprecatedProp(message: string, options: DeprecatedOptions): PropertyDecorator;
export function deprecatedProp(message?: string|DeprecatedOptions, options?: DeprecatedOptions): PropertyDecorator {
  if (typeof message === 'object') {
    options = <DeprecatedOptions>message;
    message = null;
  }

  options = options || {};

  var defaultMessage = !message;
  var addVersion = !!(options.removalVersion);
  var substitutions: Array<string|number> = [];
  var infoUrl = options.infoUrl || '';
  var additionalArgs = options.additionalArgs || [];

  if (defaultMessage && addVersion) {
    substitutions[substitutions.length] = options.removalVersion;
  }

  message = message || (addVersion ?
    'DEPRECATED %s: will be removed in version %s' :
    'DEPRECATED %s: will be removed in version future versions');

  return (target: Object, name: string | symbol, properties?: PropertyDescriptor) => {
    var methodName = `${options.className || target.constructor.name}#${name.toString()}`;

    if (defaultMessage) {
      substitutions.unshift(methodName);
    }

    if (properties) {
      var origFn = properties.value;
      properties.value = function() {
        console.warn(message, ...substitutions, infoUrl, ...additionalArgs);
        return origFn.apply(this, arguments);
      };
    }
  };
}
