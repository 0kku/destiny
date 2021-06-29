
import { prop } from "./prop.ts";
import { describeType } from "../../../../utils/describeType.ts";

export function destinyProps (
  element: HTMLElement,
  input: unknown,
): void {
  if (typeof input !== "object" || !input) {
    throw new TypeError(`Incorrect attribute value type ${describeType(input)} provided for destiny:props`);
  }

  prop(new Map(Object.entries(input)), element);
}
