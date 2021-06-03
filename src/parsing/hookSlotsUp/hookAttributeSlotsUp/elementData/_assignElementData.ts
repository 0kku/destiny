import { attribute } from "./attribute.ts";
import { destiny } from "./destiny.ts";
import { prop } from "./prop.ts";
import { on } from "./on.ts";
import type { TElementData } from "../TElementData.ts";

/**
 * Takes care of hooking up data to an element.
 * 
 * @param element Element to assign it on
 * @param data    What to assign
 */
export function assignElementData (
  element: HTMLElement,
  data: TElementData,
): void {
  attribute(data.attribute, element);
  destiny(data.destiny, element);
  prop(data.prop, element);
  on(data.on, element);
}
