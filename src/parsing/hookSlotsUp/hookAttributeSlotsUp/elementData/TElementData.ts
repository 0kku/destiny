import type { TNamespace } from "./TNamespace.ts";

export type TElementData = {
  readonly [Key in TNamespace]: Map<string, unknown>;
};
