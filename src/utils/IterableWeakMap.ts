type TEmplaceOptions<K extends object, V> = {
  insert: (key: K, map: IterableWeakMap<K, V>) => V,
  update: (oldValue: V, key: K, map: IterableWeakMap<K, V>) => V,
};

export class IterableWeakMap<
  K extends object = object,
  V = unknown,
> {
  static #cleanup = (
    { set, ref }: {
      set: Set<WeakRef<object>>,
      ref: WeakRef<object>,
    },
  ): void => {
    set.delete(ref);
  };

  #weakMap = new WeakMap<K, { value: V, ref: WeakRef<K> }>();
  #refSet = new Set<WeakRef<K>>();
  #finalizationGroup = new FinalizationRegistry(IterableWeakMap.#cleanup);

  constructor (
    iterable: Iterable<[K, V]> = [],
  ) {
    for (const [key, value] of iterable) {
      this.set(key, value);
    }
  }

  set (
    key: K,
    value: V,
  ): void {
    const currentValue = this.#weakMap.get(key);
    if (currentValue) {
      currentValue.value = value;
      return;
    }
    const ref = new WeakRef(key);
    this.#weakMap.set(key, { value, ref });
    this.#refSet.add(ref);
    this.#finalizationGroup.register(
      key,
      {
        set: this.#refSet,
        ref,
      },
      ref,
    );
  }

  get (
    key: K,
  ): V | undefined {
    return this.#weakMap.get(key)?.value;
  }

  delete (
    key: K,
  ): boolean {
    const entry = this.#weakMap.get(key);
    if (!entry) return false;
    this.#weakMap.delete(key);
    this.#refSet.delete(entry.ref);
    this.#finalizationGroup.unregister(entry.ref);
    return true;
  }

  has (
    key: K,
  ): boolean {
    return this.#weakMap.has(key);
  }

  forEach (
    cb: (value: V, key: K, map: this) => void,
  ): void {
    for (const [key, value] of this) {
      cb(value, key, this);
    }
  }

  clear (): void {
    for (const key of this.keys()) {
      this.delete(key);
    }
  }

  emplace (
    key: K,
    options: Pick<TEmplaceOptions<K, V>, "insert"> | TEmplaceOptions<K, V>,
  ): V;
  emplace (
    key: K,
    options: Pick<TEmplaceOptions<K, V>, "update">,
  ): V | undefined;
  emplace (
    key: K,
    options: Partial<TEmplaceOptions<K, V>>,
  ): V | undefined {
    const heldValue = this.#weakMap.get(key);
    if (!heldValue && options.insert) {
      const newValue = options.insert(key, this);
      this.set(key, newValue);
      return newValue;
    } else if (heldValue && options.update) {
      const newValue = options.update(heldValue.value, key, this);
      this.set(key, newValue);
      return newValue;
    } else {
      return heldValue?.value;
    }
  }

  get size (): number {
    let size = 0;
    for (const ref of this.#refSet) {
      if (ref.deref()) size++;
    }
    return size;
  }

  [Symbol.hasInstance] (
    instance: unknown,
  ): boolean {
    return instance instanceof IterableWeakMap || instance instanceof WeakMap;
  }

  *[Symbol.iterator] (): Generator<[K, V], void> {
    for (const key of this.keys()) {
      const { value } = this.#weakMap.get(key)!;
      yield [key, value];
    }
  }

  entries (): Generator<[K, V], void> {
    return this[Symbol.iterator]();
  }

  *keys (): Generator<K, void> {
    for (const ref of this.#refSet) {
      const key = ref.deref();
      if (!key) console.log("key", key);
      if (!key) continue;
      yield key;
    }
  }

  *values (): Generator<V, void> {
    for (const [, value] of this) {
      yield value;
    }
  }
}
