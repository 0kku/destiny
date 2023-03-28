import { pseudoRandomIdGenerator } from "../utils/id.ts";
import { pascalToKebab } from "../utils/pascalToKebab.ts";
import type { Component } from "./Component.ts";

const pseudoRandomId = pseudoRandomIdGenerator();

const registeredComponents = new Map<
  new () => Component,
  string
>();

/**
 * Registers a Component constructor as a Custom Element using its constructor name.
 * @param componentConstructor A constructor for the element to be registered
 * @param noHash               Opt out of adding a unique hash to the name
 */
export function register(
  componentConstructor: typeof Component,
  noHash = true,
): string {
  const registeredName = registeredComponents.get(componentConstructor);
  if (registeredName) {
    return registeredName;
  }

  const givenName = componentConstructor.name;
  const name = `${(
    givenName ? pascalToKebab(givenName) : "anonymous"
  )}${noHash ? "" : `-${pseudoRandomId.next().value}`}`;

  customElements.define(name, componentConstructor);
  registeredComponents.set(componentConstructor, name);

  return name;
}
