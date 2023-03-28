import { prop } from "./prop.ts";
import { describeType } from "../../../../utils/describeType.ts";
import { ElementData } from "../elementData/ElementData.ts";
import { elementDataStore } from "../../../../componentLogic/elementData.ts";
import { emplace } from "../../../../utils/mapEmplace.ts";
import { concat } from "../../../../utils/mapConcat.ts";

export function destinyProps(
  element: HTMLElement,
  input: unknown,
): void {
  if (typeof input !== "object" || !input) {
    throw new TypeError(
      `Incorrect attribute value type ${
        describeType(input)
      } provided for destiny:props`,
    );
  }
  const map = (
    input instanceof Map ? input : new Map(Object.entries(input))
  );

  emplace(elementDataStore, element, {
    insert: () => new ElementData({ prop: map }),
    update: (oldData) => (concat(oldData.prop, map), oldData),
  });

  prop(map, element);
}
