import type { TNamespace } from "./TNamespace.js";

export const validNamespaces = ["attribute", "prop", "call", "on", "destiny"] as const;

export function isValidNamespace (
  input: string,
): input is TNamespace {
  return validNamespaces.includes(input as TNamespace);
}
