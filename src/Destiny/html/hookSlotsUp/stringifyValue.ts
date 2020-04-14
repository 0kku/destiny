const nonRenderedValues = new Set<unknown>([
  undefined,
  null,
  true,
  false,
]);

export const shouldBeRendered = (
  input: unknown,
) => !nonRenderedValues.has(input);

export const stringifyValue = (
  input: unknown,
) => (
  shouldBeRendered(input)
  ? String(input)
  : ""
);
