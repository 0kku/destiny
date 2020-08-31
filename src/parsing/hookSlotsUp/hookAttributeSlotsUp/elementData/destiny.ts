import { destinyOut } from "./destinyOut.js";
import { destinyIn } from "./destinyIn.js";
import { destinyRef } from "./destinyRef.js";
import type { TElementData } from "../TElementData.js";

/**
 * Handler for destiny-namespaced attributes. See referenced methods for details.
 */
export function destiny (
  data: TElementData["destiny"],
  element: HTMLElement,
): void {
  for (const [key, value] of data) {
    switch (key) {
      case "ref":
        destinyRef(value, element);
      break;

      case "in":
        destinyIn(value, element);
      break;

      case "out":
        destinyOut(element, value);
      break;

      default:
        throw new Error(`Invalid property "destiny:${key}" on element:\n${element.outerHTML}.`);
    }
  }
}
