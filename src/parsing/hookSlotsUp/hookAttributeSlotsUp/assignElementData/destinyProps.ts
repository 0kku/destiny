import { prop } from "./prop.js";
import { describeType } from "../../../../utils/describeType.js";
import { ElementData } from "../elementData/ElementData.js";
import { elementDataStore } from "../../../../componentLogic/elementData.js";
import { emplace } from "../../../../utils/mapEmplace.js";
import { concat } from "../../../../utils/mapConcat.js";

export function destinyProps (
  element: HTMLElement,
  input: unknown,
): void {
  if (typeof input !== "object" || !input) {
    throw new TypeError(`Incorrect attribute value type ${describeType(input)} provided for destiny:props`);
  }
  const map = (
    input instanceof Map
    ? input
    : new Map(Object.entries(input))
  );

  emplace(elementDataStore, element, {
    insert: () => new ElementData({prop: map}),
    update: (oldData) => (concat(oldData.prop, map), oldData),
  });

  prop(map, element);
}
