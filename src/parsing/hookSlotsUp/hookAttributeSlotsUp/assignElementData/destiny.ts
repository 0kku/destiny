import { destinyRef } from "./destinyRef.js";
import { destinyUnmount } from "./destinyUnmount.js";
import { destinyMount } from "./destinyMount.js";
import { destinyProps } from "./destinyProps.js";
import { destinyData } from "./destinyData.js";
import { throwExpression } from "../../../../utils/throwExpression.js";
import type { TElementData } from "../elementData/TElementData.js";

const opMap: {
  readonly [key: string]: (element: HTMLElement, value: unknown) => void,
} = {
  ref: destinyRef,
  mount: destinyMount,
  unmount: destinyUnmount,
  props: destinyProps,
  data: destinyData,
} as const;

/**
 * Handler for destiny-namespaced attributes. See referenced methods for details.
 */
export function destiny (
  data: TElementData["destiny"],
  element: HTMLElement,
): void {
  for (const [key, value] of data) {
    const op = opMap[key] ?? throwExpression(`Invalid property "destiny:${key}" on element:\n${element.outerHTML}.`);

    op(element, value);
  }
}
