import { destinyUnmount } from "./destinyUnmount.ts";
import { destinyMount } from "./destinyMount.ts";
import { destinyRef } from "./destinyRef.ts";
import { destinyProps } from "./destinyProps.ts";
import type { TElementData } from "../TElementData.ts";

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
