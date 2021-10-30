import { isValidAttributePair } from "./elementData/isValidNamespace.js";
import type { TNamespace } from "./elementData/TNamespace.js";

export function parseAttributeName (
  input: string,
): [TNamespace, string] {
  const split = input.split(":"); 
  if (split.length === 1) {
    split.unshift("attribute");
  }

  if (!isValidAttributePair(split)) {
    throw new Error("Invalid namespace");
  }

  return split;
}
