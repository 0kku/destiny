import { pascalToKebab } from "./utils/pascalToKebab.js";

export function component (
  componentConstructor: new () => HTMLElement,
): string {
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

  return name;
}