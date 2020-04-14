import { ReactivePrimitive, ReactiveArray } from "../../../_Destiny.js";
import { valueToFragment } from "./toFragment/valueToFragment.js";
import { Slot } from "../../Slot.js";
import { SlotArray } from "../../SlotArray.js";

export function hookContentSlotsUp (
  templ: DocumentFragment,
  props: unknown[],
) {
  const contentSlots = Object.values(
    templ.querySelectorAll("[destiny\\:content]")
  ) as unknown as (HTMLElement & ChildNode)[];

  for (const contentSlot of contentSlots) {
    const index = contentSlot.getAttribute("destiny:content");
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
