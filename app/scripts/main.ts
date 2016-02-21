export function deprecatedProp(message?: string, infoUrl?: string): PropertyDecorator {
  message = message || '%s is deprecated. Please update your usages accordingly';

  return (target: Object, name: string | symbol, properties?: PropertyDescriptor) => {
    if (properties) {
      var origFn = properties.value;
      properties.value = function () {
        console.warn.apply(console, [message, `${(<any>target.constructor).name}#${name.toString()}`, infoUrl ? infoUrl : '']);
        return origFn.apply(this, arguments);
      }
    }
  }
}
