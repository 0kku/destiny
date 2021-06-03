import type { TNamespace } from "./TNamespace.ts";

export const validNamespaces = ["attribute", "prop", "on", "destiny"] as const;

export function isValidNamespace (
  input: string,
): input is TNamespace {
  return validNamespaces.includes(input as TNamespace);
}
