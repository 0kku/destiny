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

const ignoredValues = new Set<unknown>([
  undefined,
  null,
  true,
  false,
]);

function matchChangeWatcher (
  attributeName: string,
) {
  switch (attributeName) {
    case "value":
      return "input";
    case "checked":
    case "valueAsDate":
    case "valueAsNumber":
      return "change";
    default:
      return "";
  }
}

const matchIndex = /__internal_(?<index>[0-9]+)_/;

function hookAttributeSlotsUp (
  templ: DocumentFragment,
  props: unknown[],
) {
  const attributeSlots = Object.values(
    templ.querySelectorAll("[destiny\\:slot]"),
  ) as unknown as (HTMLElement & ChildNode)[];

  for (const element of attributeSlots) {
    for (let {name, value} of element.attributes) {
      const {index: nameIndex} = name.match(matchIndex)?.groups ?? {};
      const {index: valueIndex} = value.match(matchIndex)?.groups ?? {};

      if (nameIndex && valueIndex) {
        throw new NotImplementedError("You can't yet have both the name and value be a slot.");
      } else if (nameIndex) {
        const item = props[Number(nameIndex)];
        if (!item && item !== 0) continue; //WTF?
        const resolvedName = String(item);
        element.setAttribute(
          resolvedName,
          value,
        );
        if (item instanceof ReactivePrimitive) {
          let previousName = name;
          item.bind(newName => {
            element.removeAttribute(previousName);
            element.setAttribute(newName, value);
            previousName = newName;
          });
        }
      } else if (valueIndex) {
        const item = props[Number(valueIndex)];
        const {
          namespace,
          rawAttributeName,
        } = (
          name
          .match(/(?:(?<namespace>[a-z]+)\:)?(?<rawAttributeName>.+)/)
          ?.groups ?? {}
        );
        const isPropertyAssignment = namespace === "prop";
        const isMethodCall = namespace === "call";
        const isEventListener = namespace === "on";
        const isDestinyNS = namespace === "destiny";

        const attributeName = isPropertyAssignment || isMethodCall
          ? kebabToCamel(rawAttributeName)
          : rawAttributeName;

        function setAttributeValue (
          value: unknown,
        ) {
          const resolvedValue = (
            ignoredValues.has(value)
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
          if (isPropertyAssignment) {
            //@ts-ignore TODO gotta figure out later if this can be resolved properly by TS lol.
            element[attributeName] = value;
          } else if (isMethodCall) {
            if (Array.isArray(value)) {
              //@ts-ignore TODO gotta figure out later if this can be resolved properly by TS lol.
              element[attributeName](...value);
            } else {
              //@ts-ignore TODO gotta figure out later if this can be resolved properly by TS lol.
              element[attributeName](value);
            }
          } else if (isEventListener) {
            if (Array.isArray(value)) {
              //@ts-ignore TODO gotta figure out later if this can be resolved properly by TS lol.
              element.addEventListener(attributeName, ...value);
            } else {
              //@ts-ignore TODO gotta figure out later if this can be resolved properly by TS lol.
              element.addEventListener(attributeName, value);
            }
            
          } else if (isDestinyNS) {
            if (attributeName === "ref") {
              if (!(value instanceof ReactivePrimitive)) {
                throw new TypeError("Ref must be a ReactivePrimitive");
              }
              value.value = element;
            }
          } else {
            setAttributeValue(value);
          }
        }
        
        if (item instanceof ReactivePrimitive) {
          const changeWatcher = matchChangeWatcher(attributeName);
          if (changeWatcher) {
            element.addEventListener(changeWatcher, e => {
              // Sets the value whilst excluding itself of callbacks to call after the change
              item.set(
                (e.currentTarget as HTMLInputElement)
                  ?.[attributeName as "value" | "checked" | "valueAsNumber" | "valueAsDate"],
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
