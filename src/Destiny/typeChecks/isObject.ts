export function isObject (
  input: any,
): input is object {
  return input instanceof Object;
  // return input?.constructor?.name === "Object";
}