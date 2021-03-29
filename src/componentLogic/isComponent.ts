import { Component } from "./Component.js";

export function isComponent (
  input: unknown,
): input is typeof Component & (new () => Component) {
  return (
    Boolean(input) &&
    typeof input === "function" &&
    Object.prototype.isPrototypeOf.call(Component, input)
  );
}
