import { pascalToKebab } from "../utils/pascalToKebab.js";
import { DestinyElement } from "./DestinyElement.js";

const registeredComponents = new Map<
  typeof DestinyElement,
  string
>();

export function register (
  componentConstructor: typeof DestinyElement & (new () => DestinyElement),
): string {
  const registeredName = registeredComponents.get(componentConstructor);
  if (registeredName) {
    return registeredName;
  }
  
  const name = pascalToKebab(
    componentConstructor.name,
  );
  console.assert(
    !!name,
    `Component class can't be anonymous. Set a name like this:
component(class FooBar extends DestinyElement {…});`,
  );
  console.assert(
    name.includes("-"),
    `Invalid component name "${componentConstructor.name}": it must contain more than one word and be in PascalCase. Example: "FooBar"`,
  );
  customElements.define(name, componentConstructor);
  registeredComponents.set(componentConstructor, name);

  return name;
}