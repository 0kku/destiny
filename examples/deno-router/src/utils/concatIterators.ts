export function* concatIterators<T> (
  ...iterators: ReadonlyArray<IterableIterator<T>>
): Generator<T, void, undefined> {
  for (const iterator of iterators) {
    yield* iterator;
  }
}
