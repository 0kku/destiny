import { kebabToCamel } from "../../../utils/kebabToCamel.js";
import { isValidNamespace } from "./isValidNamespace.js";
import type { TNamespace } from "./TNamespace.js";

export function parseAttributeName (
  input: string,
): [TNamespace, string] {
  const {
    namespace = "attribute",
    attributeNameRaw,
  } = (
    /(?:(?<namespace>[a-z]+):)?(?<attributeNameRaw>.+)/
    .exec(input)
    ?.groups
    ?? {}
  );

  const attributeName = (
    namespace !== "attribute"
    ? kebabToCamel(attributeNameRaw)
    : attributeNameRaw
  );

  if (!isValidNamespace(namespace)) {
    throw new Error("Invalid namespace");
  }

  return [namespace, attributeName];
}
