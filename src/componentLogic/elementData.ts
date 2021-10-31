import type { TElementData } from "../parsing/hookSlotsUp/hookAttributeSlotsUp/elementData/TElementData.js";

export const elementDataStore = new WeakMap<Element, TElementData>();

export function getElementData (
  element: Element,
): TElementData | undefined {
  return elementDataStore.get(element);
}
