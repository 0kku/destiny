
import { prop } from "./prop.js";
import { describeType } from "../../../../utils/describeType.js";

export function destinyProps (
  element: HTMLElement,
  input: unknown,
): void {
  if (typeof input !== "object" || !input) {
    throw new TypeError(`Incorrect attribute value type ${describeType(input)} provided for destiny:props`);
  }

  prop(new Map(Object.entries(input)), element);
}
