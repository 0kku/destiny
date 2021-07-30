/* eslint-disable @typescript-eslint/ban-types */

export function concat <K, V> (
  mapTarget: Map<K, V>,
  mapSource: Map<K, V>,
): Map<K, V> {
  for (const [key, value] of mapSource) {
    mapTarget.set(key, value);
  }

  return mapTarget;
}