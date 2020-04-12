/**
 * Basically, because TS doesn't support nominal typing, we have to use this hack to exclude unwanted objects from our reactive methods.
 */
export const specialCaseObjects = [
  Function,
  Date,
  RegExp,
  DocumentFragment,
] as const;

export function isSpecialCaseObject (
  input: unknown
): input is ISpecialCaseObject {
  return specialCaseObjects.some(constr => input instanceof constr)
}

export type ISpecialCaseObject = InstanceType<typeof specialCaseObjects[number]>;
