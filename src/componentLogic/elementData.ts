import type { TElementData } from "../parsing/hookSlotsUp/hookAttributeSlotsUp/TElementData.ts";

export const elementData = new WeakMap<Element, TElementData>();

export function getElementData (
  element: Element,
): TElementData | undefined {
  return elementData.get(element);
}
