import { DestinyElement } from "./DestinyElement.js";

export function isDestinyElement (
  input: unknown,
): input is typeof DestinyElement & (new () => DestinyElement) {
  return (
    Boolean(input) &&
    typeof input === "function" &&
    Object.prototype.isPrototypeOf.call(DestinyElement, input)
  );
}
