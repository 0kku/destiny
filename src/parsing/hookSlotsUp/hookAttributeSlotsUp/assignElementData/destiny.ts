import { destinyRef } from "./destinyRef.ts";
import { destinyUnmount } from "./destinyUnmount.ts";
import { destinyMount } from "./destinyMount.ts";
import { destinyProps } from "./destinyProps.ts";
import { destinyData } from "./destinyData.ts";
import { throwExpression } from "../../../../utils/throwExpression.ts";
import type { TElementData } from "../elementData/TElementData.ts";

const opMap: {
  readonly [key: string]: (element: HTMLElement, value: unknown) => void;
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
export function destiny(
  data: TElementData["destiny"],
  element: HTMLElement,
): void {
  for (const [key, value] of data) {
    const op = opMap[key] ??
      throwExpression(
        `Invalid property "destiny:${key}" on element:\n${element.outerHTML}.`,
      );

    op(element, value);
  }
}
