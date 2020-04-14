import { IValueProps } from "../../hookSlotsUp.js";
import { nonRenderedValues } from "../../nonRenderedValues.js";

export function attribute (
  {
    element,
    attributeName,
    valueStart,
    valueSlot,
    valueEnd,
  }: IValueProps,
) {
  const resolvedValue = (
    nonRenderedValues.has(valueSlot)
      ? ""
      : String(valueSlot)
  );
  element.setAttribute(
    attributeName,
    `${valueStart}${resolvedValue}${valueEnd}`,
  );
}
