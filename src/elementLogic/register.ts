import { pascalToKebab } from "../utils/pascalToKebab.js";

const registeredComponents = new Map<
  new () => HTMLElement,
  string
>();

export function register (
  componentConstructor: new () => HTMLElement,
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