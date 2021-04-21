import type { ReactivePrimitive } from "../reactive/ReactivePrimitive.js";

/**
 * Synchonizes a CSS property of an element to a ReactivePrimitive.
 * 
 * @param element   Target element
 * @param property  CSS property to be synchronized
 * @param source    A ReactivePrimitive whose value is to be used for the CSS Property
 */
export function attachCSSProperty (
  element: HTMLElement,
  property: string,
  source: ReactivePrimitive<string>,
): void {
  source.bind(value => element.style.setProperty(property, String(value)));
}
