import { IValueProps } from "../../hookSlotsUp.js";

export const prop = (
  {
    element,
    attributeName,
    valueStart,
    valueSlot,
    valueEnd,
  }: IValueProps,
) => {
  const value = (
    valueStart || valueEnd
    ? `${valueStart}${valueSlot}${valueEnd}`
    : valueSlot
  );
  //@ts-ignore TODO gotta figure out later if this can be resolved properly by TS lol.
  element[kebabToCamel(attributeName)] = value;
};
