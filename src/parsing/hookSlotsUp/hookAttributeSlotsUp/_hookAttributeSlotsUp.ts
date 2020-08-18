import { ReactivePrimitive } from "../../../mod.js";
import { attributeNamespaces } from "./attributeNamespaces/_attributeNamespaces.js";
import { matchChangeWatcher, TWatchedAttribute } from "./matchChangeWatcher.js";
import { kebabToCamel } from "../../../utils/kebabToCamel.js";

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
    templ.querySelectorAll("[destiny\\:attr]"),
  ) as unknown as Array<HTMLElement & ChildNode>;

  for (const element of attributeSlots) {
    for (const {name, value} of element.attributes) {
      const {
        valueStart = "",
        index,
        valueEnd = "",
      } = (
        /(?<valueStart>.+)?__internal_(?<index>[0-9]+)_(?<valueEnd>.+)?/u
        .exec(value)
        ?.groups
        ?? {}
      );

      if (index) {
        const item = props[Number(index)];
        const {
          namespace = "",
          attributeNameRaw,
        } = (
          /(?:(?<namespace>[a-z]+):)?(?<attributeNameRaw>.+)/
          .exec(name)
          ?.groups
          ?? {}
        );
        const attributeName = (
          namespace
          ? kebabToCamel(attributeNameRaw)
          : attributeNameRaw
        );

        const setValue = (
          valueSlot: unknown,
        ) => (
          attributeNamespaces
          .get(
            namespace as "" | "prop" | "call" | "on" | "destiny",
          )?.({
            element,
            attributeName,
            valueSlot,
            valueStart,
            valueEnd,
          })
        );
        
        if (namespace === "destiny") {
          setValue(item);
        } else if (item instanceof ReactivePrimitive) {
          const changeWatcher = matchChangeWatcher(attributeName);
          if (changeWatcher) {
            element.addEventListener(changeWatcher, e => {
              // Sets the value whilst excluding itself of callbacks to call after the change
              item.set(
                (e.currentTarget as HTMLInputElement | null)
                ?.[attributeName as TWatchedAttribute],
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
