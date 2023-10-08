declare global {
  interface Node {
    on(
      name: string,
      selector:
        | string
        // eslint-disable-next-line @typescript-eslint/ban-types
        | null
        | undefined
        | ((...args: any) => unknown),
      fn: (...args: any) => unknown,
    ): void;
  }
}

Node.prototype.on = function (name: string, selector, fn) {
  if (typeof selector === 'function') {
    this.addEventListener(name, selector);
    return;
  }

  this.addEventListener(name, function (event: Event) {
    if (
      selector &&
      event.target instanceof Element &&
      event.target?.matches(selector)
    ) {
      return fn.apply(event.target, arguments);
    }
  });
};
