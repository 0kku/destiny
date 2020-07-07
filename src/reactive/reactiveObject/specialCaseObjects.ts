import { TemplateResult } from "../../html/TemplateResult.js";

/**
 * Basically, because TS doesn't support nominal typing, we have to use this hack to exclude unwanted objects from our reactive methods.
 */
export const specialCaseObjects = [
  Function,
  Date,
  RegExp,
  DocumentFragment,
  TemplateResult,
] as const;

export function isSpecialCaseObject (
  input: unknown
): input is ISpecialCaseObject {
  const isSpecial = specialCaseObjects.some(constr => input instanceof constr);
  if (!isSpecial && input instanceof Object && input.constructor !== Object) {
    console.warn(`The properties of an object whose constructor wasn't Object got implicitly converted to become reactive. This is a problem with TypeScript's lack for nominal typing. More info: https://github.com/0kku/destiny/issues/9
    
    If this was intentional, you can ignore this warning. If not, for now, the workaround is to wrap your object in new ReactivePrimitive(yourObject).
    
    Object in question:`, input);
  }

  return isSpecial;
}

export type ISpecialCaseObject = InstanceType<typeof specialCaseObjects[number]>;
