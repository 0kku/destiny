import { ReactivePrimitive } from "../../../_Destiny.js";
import { attributeNamespaces } from "./attributeNamespaces/_attributeNamespaces.js";
import { matchChangeWatcher, watchedAttribute } from "./matchChangeWatcher.js";
import { kebabToCamel } from "../../../utils/kebabToCamel.js";

/**
 * Goes through all the elements in a template that are flagged with the `destiny::attr` attribute and figures out what events need to be listened to, and how the DOM needs to be updated if any of the given props are reactive.
 * @param templ A template element that has been processed by `resolveSlots()`.
 * @param props Any items that were slotted into the HTML template
 */
export function hookAttributeSlotsUp (
  templ: DocumentFragment,
  props: unknown[],
) {
  const attributeSlots = Object.values(
    templ.querySelectorAll("[destiny\\:attr]"),
  ) as unknown as (HTMLElement & ChildNode)[];

  for (const element of attributeSlots) {
    for (let {name, value} of element.attributes) {
      const [
        ,
        valueStart = "",
        index,
        valueEnd = "",
       ] = (
        value
        .match(
          /(.+)?__internal_([0-9]+)_(.+)?/
        )
        ?? []
      );

      if (index) {
        const item = props[Number(index)];
        let [
          ,
          namespace = "",
          attributeName,
         ] = (
          name
          .match(/(?:([a-z]+)\:)?(.+)/)
          ?? []
        );
        if (namespace) {
          attributeName = kebabToCamel(attributeName);
        }

        const setValue = (
          valueSlot: unknown,
        ) => (
          attributeNamespaces
          .get(namespace)
          ?.({
            element,
            attributeName,
            valueSlot,
            valueStart,
            valueEnd,
          })
        );
        
        if (item instanceof ReactivePrimitive) {
          const changeWatcher = matchChangeWatcher(attributeName);
          if (changeWatcher) {
            element.addEventListener(changeWatcher, e => {
              // Sets the value whilst excluding itself of callbacks to call after the change
              item.set(
                (e.currentTarget as HTMLInputElement)
                  ?.[attributeName as watchedAttribute],
                setValue,
              );
            });
          }
          item.bind(setValue);
        } else {
          setValue(item);
        }
      }
    }
  }
}
