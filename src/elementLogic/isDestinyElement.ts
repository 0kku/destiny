import { DestinyElement } from "./DestinyElement.js";

export function isDestinyElement (
  input: unknown,
): input is new () => DestinyElement {
  return (
    input &&
    typeof input === "function" &&
    Object.prototype.isPrototypeOf.call(DestinyElement, input)
  );
}
