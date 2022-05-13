import { attribute } from "./attribute.ts";
import { destiny } from "./destiny.ts";
import { prop } from "./prop.ts";
import { on } from "./on.ts";
import { elementDataStore } from "../../../../componentLogic/elementData.ts";
import { validNamespaces } from "../elementData/isValidNamespace.ts";
import { emplace } from "../../../../utils/mapEmplace.ts";
import { concat } from "../../../../utils/mapConcat.ts";
import type { TElementData } from "../elementData/TElementData.ts";

/**
 * Takes care of hooking up data to an element.
 *
 * @param element Element to assign it on
 * @param data    What to assign
 */
export function assignElementData(
  element: HTMLElement,
  data: TElementData,
  options: {
    elementDataAlreadySet?: boolean;
  } = {},
): void {
  if (!options.elementDataAlreadySet) {
    emplace(elementDataStore, element, {
      insert: () => data,
      update: (oldData) => {
        for (const namespace of validNamespaces) {
          concat(
            oldData[namespace],
            data[namespace],
          );
        }
        return oldData;
      },
    });
  }

  attribute(data.attribute, element);
  destiny(data.destiny, element);
  prop(data.prop, element);
  on(data.on, element);
}
