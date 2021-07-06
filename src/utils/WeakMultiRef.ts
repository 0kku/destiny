const refs = new Set<WeakMultiRef>();

export class WeakMultiRef {
  #cleanup = (
    { set, ref, target }: {
      // deno-lint-ignore ban-types
      set: Set<WeakRef<object>>,
      // deno-lint-ignore ban-types
      ref: WeakRef<object>,
      target: WeakMultiRef,
    },
  ): void => {
    set.delete(ref);
    if (!set.size) {
      refs.delete(target);
    }
  };

  // deno-lint-ignore ban-types People can pass literally anything into ReactiveArray
  weakKeys = new Set<WeakRef<object>>();
  #finalizationGroup = new FinalizationRegistry(this.#cleanup);

  constructor (
    // deno-lint-ignore ban-types People can pass literally anything into ReactiveArray
    keys: ReadonlyArray<object>,
  ) {
    keys.forEach(key => {
      const ref = new WeakRef(key);
      this.weakKeys.add(ref);
      this.#finalizationGroup.register(
        key,
        {
          set: this.weakKeys,
          ref,
          target: this,
        },
        ref,
      );
    });
    
    refs.add(this);
  }
}
