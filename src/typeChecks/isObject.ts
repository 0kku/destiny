/**
 * Checks if input is a non-function Object.
 * 
 * @param input The item to be checked
 */
export function isObject (
  input: unknown,
): input is object {
  return input && typeof input === "object";
}
