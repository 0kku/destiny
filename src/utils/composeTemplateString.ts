export function composeTemplateString(
  strings: TemplateStringsArray,
  props: ReadonlyArray<unknown>,
): string {
  return strings.reduce(
    (result, string, i) => `${result}${String(props[i - 1])}${string}`,
  );
}
