import type { TElementData } from "./TElementData.ts";

export class ElementData {
  prop = new Map<string, unknown>();
  on = new Map<string, unknown>();
  destiny = new Map<string, unknown>();
  attribute = new Map<string, unknown>();

  constructor(
    data?: Partial<TElementData>,
  ) {
    if (data) Object.assign(this, data);
  }
}
