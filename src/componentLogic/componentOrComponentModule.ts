import { isComponent } from "./isComponent.js";
import { describeType } from "../utils/describeType.js";
import type { Component } from "../mod.js";

export function componentOrComponentModule (
  module: unknown,
): typeof Component & (new () => Component) {
  if (isComponent(module)) {
    return module;
  }
  if (typeof module !== "object" || !module) {
    throw new TypeError(`Invalid type ${describeType(module)} supplied for prop:for`);
  }
  const component = (module as {default?: unknown}).default;
  if (!isComponent(component)) {
    throw new TypeError(`Invalid component constructor ${describeType(component)} supplied for asynchronously loaded element. Expected type is a Promise that resolves to a Component or to a module with a Component as the default export.`);
  }
  return component;
}
