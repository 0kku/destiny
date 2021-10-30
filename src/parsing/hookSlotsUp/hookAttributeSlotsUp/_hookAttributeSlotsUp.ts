import { resolveSlotPropIndex } from "./resolveSlotPropIndex.js";
import { parseAttributeName } from "./parseAttributeName.js";
import { assignElementData } from "./assignElementData/_assignElementData.js";
import { elementDataStore } from "../../../componentLogic/elementData.js";
import { ElementData } from "./elementData/ElementData.js";

/**
 * Goes through all the elements in a template that are flagged with the `destiny::attr` attribute and figures out what events need to be listened to, and how the DOM needs to be updated if any of the given props are reactive.
 * @param templ A template element that has been processed by `resolveSlots()`.
 * @param props Any items that were slotted into the HTML template
 */
export function hookAttributeSlotsUp (
  templ: DocumentFragment,
  props: Array<unknown>,
): void {
  const attributeSlots = Object.values(
    templ.querySelectorAll("[destiny\\:attr],[data-capture-props]"),
  ) as unknown as Array<HTMLElement & ChildNode>;

  for (const element of attributeSlots) {
    const { captureProps } = element.dataset;
    const values = new ElementData;
    for (const {name, value} of element.attributes) {
      const propIndex = resolveSlotPropIndex(value);

      // skip if attribute wasn't slotted
      if (propIndex === -1) {
        if (captureProps && name !== "destiny:attr") {
          const [namespace, attributeName] = parseAttributeName(name);
          values[namespace].set(attributeName, value);
        }
        continue;
      }

      const attrVal = props[propIndex];
      const [namespace, attributeName] = parseAttributeName(name);
      values[namespace].set(attributeName, attrVal);
    }
    
    elementDataStore.set(element, values);
    if (!captureProps) {
      assignElementData(
        element,
        values,
        {elementDataAlreadySet: true},
      );
    }
  }
}
