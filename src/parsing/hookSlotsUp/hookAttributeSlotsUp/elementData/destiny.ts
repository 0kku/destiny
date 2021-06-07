import { destinyUnmount } from "./destinyUnmount.js";
import { destinyMount } from "./destinyMount.js";
import { destinyRef } from "./destinyRef.js";
import { destinyProps } from "./destinyProps.js";
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

      case "mount":
        destinyMount(value, element);
      break;

      case "unmount":
        destinyUnmount(element, value);
      break;

      case "props":
        destinyProps(element, value);
      break;

      default:
        throw new Error(`Invalid property "destiny:${key}" on element:\n${element.outerHTML}.`);
    }
  }
}
