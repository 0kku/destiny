import { TemplateResult } from "../../parsing/TemplateResult.js";

/**
 * Basically, because TS doesn't support nominal typing, we have to use this hack to exclude unwanted objects from our reactive methods.
 */
export const specialCaseObjects = [
  Function,
  Date,
  RegExp,
  DocumentFragment,
  TemplateResult,
  Node,
] as const;

export function isSpecialCaseObject (
  input: unknown,
): input is TSpecialCaseObject {
  const type = typeof input;
  if (type === "function") return true;
  else if (type !== "object") return false;
  else return specialCaseObjects.some(constr => input instanceof constr);
}

export type TSpecialCaseObject = InstanceType<typeof specialCaseObjects[number]>;
