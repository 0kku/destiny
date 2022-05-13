/* eslint-disable @typescript-eslint/ban-types */

type TEmplaceOptions<K, V> = {
  insert: (key: K, map: Map<K, V> | WeakMap<K & object, V>) => V,
  update: (oldValue: V, key: K, map: Map<K, V> | WeakMap<K & object, V>) => V,
};

export function emplace <K, V> (
  map: Map<K, V>,
  key: K,
  options: Pick<TEmplaceOptions<K, V>, "insert"> | TEmplaceOptions<K, V>,
): V;
export function emplace <K extends object, V> (
  map: WeakMap<K, V>,
  key: K,
  options: Pick<TEmplaceOptions<K, V>, "insert"> | TEmplaceOptions<K, V>,
): V;
export function emplace <K, V> (
  map: Map<K, V>,
  key: K,
  options: Pick<TEmplaceOptions<K, V>, "update">,
): V | undefined;
export function emplace <K extends object, V> (
  map: WeakMap<K, V>,
  key: K,
  options: Pick<TEmplaceOptions<K, V>, "update">,
): V | undefined;
export function emplace <K, V> (
  map: Map<K, V> | WeakMap<K & object, V>,
  key: K,
  options: Partial<TEmplaceOptions<K, V>>,
): V | undefined {
  const heldValue = map.get(key as K & object);
  if (!heldValue && options.insert) {
    const newValue = options.insert(key, map);
    map.set(key as K & object, newValue);
    return newValue;
  } else if (heldValue && options.update) {
    const newValue = options.update(heldValue, key, map);
    map.set(key as K & object, newValue);
    return newValue;
  } else {
    return heldValue;
  }
}
