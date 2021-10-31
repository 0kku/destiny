import { attribute } from "./attribute.js";
import { destiny } from "./destiny.js";
import { prop } from "./prop.js";
import { on } from "./on.js";
import { elementDataStore } from "../../../../componentLogic/elementData.js";
import { validNamespaces } from "../elementData/isValidNamespace.js";
import { emplace } from "../../../../utils/mapEmplace.js";
import { concat } from "../../../../utils/mapConcat.js";
import type { TElementData } from "../elementData/TElementData.js";

/**
 * Takes care of hooking up data to an element.
 * 
 * @param element Element to assign it on
 * @param data    What to assign
 */
export function assignElementData (
  element: HTMLElement,
  data: TElementData,
  options: {
    elementDataAlreadySet?: boolean,
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
      }
    });
  }

  attribute(data.attribute, element);
  destiny(data.destiny, element);
  prop(data.prop, element);
  on(data.on, element);
}
