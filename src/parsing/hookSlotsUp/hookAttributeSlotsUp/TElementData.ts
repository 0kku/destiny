import type { TNamespace } from "./TNamespace";

export type TElementData = {
  readonly [Key in TNamespace]: Map<string, unknown>
};
