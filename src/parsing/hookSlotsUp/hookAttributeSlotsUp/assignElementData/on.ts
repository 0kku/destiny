import type { TElementData } from "../elementData/TElementData.js";

/**
 * `on:<EventName>` adds an event listener. It either takes a
 * callback function, or an array containing a callback
 * function and options.
 * 
 * Example usage:
 * ```html
 * <button on:click=${() => alert("Hi!")}>Click me!</button>
 * 
 * <container-block
 *   on:scroll=${[scrollHandler, {passive:true}]}
 * ></container-block>
 * ```
 */
export function on (
  eventListeners: TElementData["on"],
  element: HTMLElement,
): void {
  for (const [key, value] of eventListeners) {
    if (Array.isArray(value)) {
      //@ts-ignore TODO gotta figure out later if this can be resolved properly by TS
      element.addEventListener(key, ...value);
    } else {
      //@ts-ignore TODO gotta figure out later if this can be resolved properly by TS
      element.addEventListener(key, value);
    }
  }
}
