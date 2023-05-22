export function searchInsertionPointInSortedArray <T> (
  array: Array<T>,
  value: T,
  compareFn: (a: T, b: T) => number,
): number {
  let start = 0;
  let end = array.length - 1;
  while (end - start > 1) {
    const testIndex = Math.floor((end + start) / 2);
    const result = compareFn(array[testIndex]!, value);
    if (result < 0) {
      start = testIndex;
    } else {
      end = testIndex;
    }
  }
  return (
    compareFn(value, array[start]!) < 0
    ? start
    : end + Number(compareFn(value, array[end]!) > 0)
  );
}
