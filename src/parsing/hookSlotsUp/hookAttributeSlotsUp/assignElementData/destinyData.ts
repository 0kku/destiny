import { describeType } from "../../../../utils/describeType.ts";
import { assignElementData } from "./_assignElementData.ts";
import { ElementData } from "../elementData/ElementData.ts";

export function destinyData(
  element: HTMLElement,
  input: unknown,
): void {
  if (typeof input === "undefined") return;

  if (typeof input !== "object" || !input) {
    throw new TypeError(
      `Invalid value ${describeType(input)} provided for destiny:data`,
    );
  }

  assignElementData(
    element,
    new ElementData(input),
  );
}
