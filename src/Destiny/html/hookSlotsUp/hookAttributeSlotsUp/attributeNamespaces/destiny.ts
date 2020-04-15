import { IValueProps } from "../../_hookSlotsUp.js";
import { ReactivePrimitive } from "../../../../_Destiny.js";

export const destiny = (
  {
    element,
    attributeName,
    valueSlot,
  }: IValueProps,
) => {
  if (attributeName === "ref") {
    if (!(valueSlot instanceof ReactivePrimitive)) {
      throw new TypeError("Ref must be a ReactivePrimitive");
    }
    valueSlot.value = element;
  } else if (attributeName === "in") {
    if (!(valueSlot instanceof Function)) {
      throw new TypeError("Value of destiny:in must be a function");
    }
    queueMicrotask(
      () => valueSlot(element),
    );
  }
}
