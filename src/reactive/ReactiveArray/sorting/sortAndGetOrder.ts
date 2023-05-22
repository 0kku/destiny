export function sortAndGetOrder <T> (
  input: Array<T>,
  compareFn: (a: T, b: T) => number,
): [Array<T>, Array<number>] {
  const entries = [...input.entries()].sort(
    ([, a], [, b]) => compareFn(a, b),
  );

  const output = [];
  const order = [];

  for (const [k, v] of entries) {
    output.push(v);
    order.push(k);
  }

  return [output, order];
}
