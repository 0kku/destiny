const refs = new Set<object>();

export class WeakMultiRef {
  static #cleanup = (
    { set, ref, target }: {
      set: Set<WeakRef<object>>,
      ref: WeakRef<object>,
      target: WeakMultiRef,
    },
  ): void => {
    set.delete(ref);
    if (!set.size) {
      refs.delete(target);
    }
  };

  weakKeys = new Set<WeakRef<object>>();
  #finalizationGroup = new FinalizationRegistry(WeakMultiRef.#cleanup);

  constructor (
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
