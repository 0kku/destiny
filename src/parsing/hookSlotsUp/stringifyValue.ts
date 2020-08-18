const nonRenderedValues = new Set<unknown>([
  undefined,
  null,
  true,
  false,
]);

export const shouldBeRendered = (
  input: unknown,
): boolean => !nonRenderedValues.has(input);

/**
 * Converts a value that is about to be rendered in DOM into a string representation. `boolean`s and _nullish_ values are not rendered by design. 
 * @param input 
 */
export const stringifyValue = (
  input: unknown,
): string => (
  shouldBeRendered(input)
    ? String(input)
    : ""
);
