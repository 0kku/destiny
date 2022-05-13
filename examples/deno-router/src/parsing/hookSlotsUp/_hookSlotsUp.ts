import { hookContentSlotsUp } from "./hookContentSlotsUp/_hookContentSlotsUp.ts";
import { hookAttributeSlotsUp } from "./hookAttributeSlotsUp/_hookAttributeSlotsUp.ts";


export type TValueProps = {
  element: HTMLElement & ChildNode,
  attributeName: string,
  valueStart: string,
  valueSlot: unknown,
  valueEnd: string,
};

/**
 * Goes through the elements in a given `HTMLTemplateElement`, and adds reactivity to any slots that were given a reactive item to keep the view in sync with the application state.
 * @param template A parsed `HTMLTemplateElement` which has been processed by `resolveSlots()`
 * @param props Items that were originally slotted into the template prior to parsing
 */
export function hookSlotsUp (
  template: DocumentFragment,
  props: Array<unknown>,
): void {
  hookAttributeSlotsUp(template, props);
  hookContentSlotsUp(template, props);
}
