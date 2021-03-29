// import { kebabToCamel } from "../../../utils/kebabToCamel.js";
import { isValidNamespace } from "./isValidNamespace.js";
import type { TNamespace } from "./TNamespace.js";

export function parseAttributeName (
  input: string,
): [TNamespace, string] {
  const {
    namespace = "attribute",
    attributeName,
  } = (
    /(?:(?<namespace>[a-z]+):)?(?<attributeName>.+)/
    .exec(input)
    ?.groups
    ?? {}
  );

  if (!isValidNamespace(namespace)) {
    throw new Error("Invalid namespace");
  }

  return [namespace, attributeName];
}
