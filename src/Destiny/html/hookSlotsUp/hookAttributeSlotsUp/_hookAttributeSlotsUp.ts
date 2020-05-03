import { ReactivePrimitive } from "../../../_Destiny.js";
import { attributeNamespaces } from "./attributeNamespaces/_attributeNamespaces.js";
import { matchChangeWatcher, watchedAttribute } from "./matchChangeWatcher.js";

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
        const [
          ,
          namespace = "",
          attributeName,
         ] = (
          name
          .match(/(?:([a-z]+)\:)?(.+)/)
          ?? []
        );

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
