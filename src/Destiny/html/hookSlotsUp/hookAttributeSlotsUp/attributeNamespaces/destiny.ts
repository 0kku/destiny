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
  } else if (attributeName === "callback") {
    if (!(valueSlot instanceof Function)) {
      throw new TypeError("Callback must be a function");
    }
    valueSlot(element);
  }
}
