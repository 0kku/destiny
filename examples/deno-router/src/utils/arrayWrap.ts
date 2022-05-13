export type TArrayWrap<T> = T extends ReadonlyArray<unknown> ? T : [T];

export function arrayWrap<T> (
  input: T
): TArrayWrap<T> {
  return (Array.isArray(input) ? input : [input]) as TArrayWrap<T>;
}
