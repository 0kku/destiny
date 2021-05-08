import { attribute } from "./attribute.js";
import { destiny } from "./destiny.js";
import { prop } from "./prop.js";
import { on } from "./on.js";
import type { TElementData } from "../TElementData.js";

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
