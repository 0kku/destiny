import { Component } from "./Component.ts";

export function isComponent(
  input: unknown,
): input is typeof Component & (new () => Component) {
  return (
    Boolean(input) &&
    typeof input === "function" &&
    Object.prototype.isPrototypeOf.call(Component, input)
  );
}
