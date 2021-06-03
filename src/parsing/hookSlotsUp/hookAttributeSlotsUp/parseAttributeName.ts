// import { kebabToCamel } from "../../../utils/kebabToCamel.ts";
import { isValidNamespace } from "./isValidNamespace.ts";
import type { TNamespace } from "./TNamespace.ts";

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
