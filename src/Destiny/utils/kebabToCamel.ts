/**
 * Converts kebab-cased text to camelCased text.
 * @param input string to be converted
 */
export function kebabToCamel (
  input: string,
) {
  return input.replace(
    /(-[a-z])/g,
    match => match[1].toUpperCase(),
  );
}
