import { ReactivePrimitive, ReactiveArray } from "../_Destiny.js";
import { valueToFragment } from "./toFragment/valueToFragment.js";
import { Slot } from "./Slot.js";
import { SlotArray } from "./SlotArray.js";
import { NotImplementedError } from "../utils/NotImplementedError.js";

function camelToKebab (
  input: string,
) {

}

function kebabToCamel (
  input: string,
) {
  const pascal = kebabToPascal(input);
  return pascal[0].toLowerCase() + pascal.slice(1);
}

function kebabToPascal (
  input: string,
) {
  return input.replace(
    /(-[a-z])/g,
    match => match[1].toUpperCase(),
  );
}

function hookAttributeSlotsUp (
  templ: DocumentFragment,
  props: unknown[],
) {
  const attributeSlots = Object.values(
    templ.querySelectorAll("[data-DestinyAttributeSlot]"),
  ) as unknown as (HTMLElement & ChildNode)[];

  for (const element of attributeSlots) {
    for (let {name, value} of element.attributes) {
      const isValueSlot = value.startsWith("@internal_");
      const isNameSlot = name.startsWith("@internal_");

      if (isNameSlot && isValueSlot) {
        throw new NotImplementedError("You can't yet have both the name and value be a slot.");
      } else if (isNameSlot) {
        const index = name.substring(10);
        const item = props[Number(index)];
        if (!item && item !== 0) continue;
        const resolvedName = String(item);
        element.setAttribute(
          resolvedName,
          value,
        );
        if(item instanceof ReactivePrimitive) {
          let previousName = name;
          item.bind(newName => {
            element.removeAttribute(previousName);
            element.setAttribute(newName, value);
            previousName = newName;
          });
        }
      } else if (isValueSlot) {
        const index = value.substring(10);
        const item = props[Number(index)];
        const isAssignment = name.startsWith("@");
        const attributeName = isAssignment ? kebabToCamel(name.substring(1)) : name;

        function setAttributeValue (
          value: unknown,
        ) {
          const resolvedValue = (
            ["boolean", "undefined"].includes(typeof value) ||
            value === null
              ? ""
              : String(value)
          );
          element.setAttribute(
            attributeName,
            resolvedValue,
          );
        }

        function setValue (
          value: unknown,
        ) {
          if (isAssignment) {
            //@ts-ignore TODO gotta figure out later if this can be resolved properly by TS lol.
            element[attributeName] = value;
          } else {
            setAttributeValue(value);
          }
        }
        
        if (item instanceof ReactivePrimitive) {
          console.log(attributeName, kebabToCamel(attributeName));
          const changeWatcher = (
            attributeName === "value" ? "input" :
            attributeName === "valueAsDate" ? "change" :
            attributeName === "valueAsNumber" ? "change" :
            attributeName === "checked" ? "change" :
            ""
          );
          if (changeWatcher) {
            element.addEventListener(changeWatcher, e => {
              console.log("Changed!", (e.currentTarget as HTMLInputElement)?.[attributeName as "value" | "checked" | "valueAsNumber" | "valueAsDate"]);
              // Sets the value whilst excluding itself of callbacks to call after the change
              item.set(
                (e.currentTarget as HTMLInputElement)?.[attributeName as "value" | "checked" | "valueAsNumber" | "valueAsDate"],
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

function hookContentSlotsUp (
  templ: DocumentFragment,
  props: unknown[],
) {
  const contentSlots = Object.values(
    templ.querySelectorAll(".__DestinySlot")
  ) as unknown as (HTMLOrSVGElement & ChildNode)[];

  for (const contentSlot of contentSlots) {
    const index = contentSlot.dataset.index;
    const item = props[Number(index)];
    // console.log("contenthook", templ);
    if (item instanceof ReactivePrimitive) {
      const slot = new Slot(contentSlot);
      item.bind(value => {
        slot.update(valueToFragment(value));
      });
    } else if (item instanceof ReactiveArray) {
      new SlotArray(contentSlot, item);
    } else {
      new Slot(contentSlot, valueToFragment(item));
    }
  }
}

export function hookSlotsUp (
  templ: DocumentFragment,
  props: unknown[],
) {
  hookAttributeSlotsUp(templ, props);
  hookContentSlotsUp(templ, props);
}
