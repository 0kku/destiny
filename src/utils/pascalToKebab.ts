export function pascalToKebab (
  input: string,
): string {
  return input.replace(
    /(?<!^)([A-Z])/g,
    "-$1",
  ).toLowerCase();
}
