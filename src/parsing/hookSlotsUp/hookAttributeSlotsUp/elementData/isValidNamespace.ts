import type { TNamespace } from "./TNamespace.js";

export const validNamespaces = ["attribute", "prop", "on", "destiny"] as const;

export function isValidNamespace (
  input: string,
): input is TNamespace {
  return validNamespaces.includes(input as TNamespace);
}

export function isValidAttributePair (
  input: ReadonlyArray<string>,
): input is [TNamespace, string] {
  return input.length === 2 && isValidNamespace(input[0]!);
}
