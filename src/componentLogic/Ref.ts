export class Ref<T = HTMLElement> {
  #resolve!: (value: T) => void;
  #promise = new Promise<T>(resolve => {
    this.#resolve = resolve;
  });

  constructor (
    suppress?: "suppress",
  ) {
    if (!suppress) {
      console.warn("Refs are deprecated and will be removed in a future release. Use a ReactiveValue instead. Pass \"suppress\" to the constructor to suppress this warning.");
    }
  }

  set value (
    element: T,
  ) {
    this.#resolve(element);
  }

  then<R> (
    callbackFn: (value: T) => R,
  ): Promise<R> {
    return this.#promise.then(callbackFn);
  }
}
