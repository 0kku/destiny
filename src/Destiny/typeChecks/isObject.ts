/**
 * The original intent of this method was to check if a given item is an object was created with the object literal, but TypeScript doesn't support nominal typing an doesn't consider `Object.prototype.constructor.name` in its type system. Currently, it just checks if the given value is an instance of `Object`. Something better needs to be done for this.
 * @param input The item to be checked
 */
export function isObject (
  input: any,
): input is object {
  return input instanceof Object;
  // return input?.constructor?.name === "Object"; // TS doesn't like nominal typing :(
}
