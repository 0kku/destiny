import { IValueProps } from "../../_hookSlotsUp.js";
import { kebabToCamel } from "../../../../utils/kebabToCamel.js";

export const call = (
  {
    element,
    attributeName,
    valueSlot,
  }: IValueProps,
) => {
  const name = kebabToCamel(attributeName);
  if (Array.isArray(valueSlot)) {
    //@ts-ignore TODO gotta figure out later if this can be resolved properly by TS lol.
    element[name](...valueSlot);
  } else {
    //@ts-ignore TODO gotta figure out later if this can be resolved properly by TS lol.
    element[name](valueSlot);
  }
}
