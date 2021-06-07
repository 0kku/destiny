export function pascalToKebab (
  input: string,
): string {
  return input[0].toLowerCase() + input.slice(1).replace(
    /([A-Z])/g,
    "-$1",
  );
}
