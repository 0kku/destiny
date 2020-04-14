import { IValueProps } from "../../hookSlotsUp.js";

export const on = (
  {
    element,
    attributeName,
    valueSlot,
  }: IValueProps,
) => {
  if (Array.isArray(valueSlot)) {
    //@ts-ignore TODO gotta figure out later if this can be resolved properly by TS lol.
    element.addEventListener(attributeName, ...valueSlot);
  } else {
    //@ts-ignore TODO gotta figure out later if this can be resolved properly by TS lol.
    element.addEventListener(attributeName, valueSlot);
  }
}
