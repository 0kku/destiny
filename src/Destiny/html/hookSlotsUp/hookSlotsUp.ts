import { hookContentSlotsUp } from "./hookContentSlotsUp/_hookContentSlotsUp.js";
import { hookAttributeSlotsUp } from "./hookAttributeSlotsUp/_hookAttributeSlotsUp.js";


export interface IValueProps {
  element: HTMLElement & ChildNode,
  attributeName: string,
  valueStart: string,
  valueSlot: unknown,
  valueEnd: string,
}

export function hookSlotsUp (
  templ: DocumentFragment,
  props: unknown[],
) {
  hookAttributeSlotsUp(templ, props);
  hookContentSlotsUp(templ, props);
}
