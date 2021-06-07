export function pascalToKebab (
  input: string,
): string {
  return `${input[0]}${input.slice(1).replace(
    /([A-Z])/g,
    "-$1",
  )}`.toLowerCase();
}
