import { describeType } from "../../../../utils/describeType.js";
import { assignElementData } from "./_assignElementData.js";
import { ElementData } from "../elementData/ElementData.js";

export function destinyData (
  element: HTMLElement,
  input: unknown,
): void {
  if (typeof input === "undefined") return;

  if (typeof input !== "object" || !input) {
    throw new TypeError(`Invalid value ${describeType(input)} provided for destiny:data`);
  }

  assignElementData(
    element,
    new ElementData(input),
  );
}
