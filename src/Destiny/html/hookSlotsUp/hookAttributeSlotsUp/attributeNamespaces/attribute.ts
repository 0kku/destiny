import { IValueProps } from "../../_hookSlotsUp.js";
import { stringifyValue } from "../../stringifyValue.js";

export function attribute (
  {
    element,
    attributeName,
    valueStart,
    valueSlot,
    valueEnd,
  }: IValueProps,
) {
  element.setAttribute(
    attributeName,
    `${valueStart}${stringifyValue(valueSlot)}${valueEnd}`,
  );
}
