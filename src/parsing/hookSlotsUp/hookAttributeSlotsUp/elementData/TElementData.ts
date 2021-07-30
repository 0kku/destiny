import type { TNamespace } from "./TNamespace.js";

export type TElementData = {
  readonly [Key in TNamespace]: Map<string, unknown>
};
