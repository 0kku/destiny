import type { ReadonlyReactivePrimitive } from "../reactive/ReactivePrimitive.ts";

/**
 * Synchonizes a CSS property of an element to a ReactivePrimitive.
 * 
 * @param element   Target element
 * @param property  CSS property to be synchronized
 * @param source    A ReactivePrimitive whose value is to be used for the CSS Property
 */
export function attachCSSProperties (
  element: HTMLElement,
  styles: {
    [Key: string]: ReadonlyReactivePrimitive<string>,
  },
): void {
  for (const [property, source] of Object.entries(styles)) {
    source.bind(
      value => element.style.setProperty(property, value),
      { dependents: [element] },
    );
  }
}
