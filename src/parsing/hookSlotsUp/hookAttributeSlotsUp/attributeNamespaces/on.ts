import type { TValueProps } from "../../_hookSlotsUp.js";

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
export const on = (
  {
    element,
    attributeName,
    valueSlot,
  }: TValueProps,
): void => {
  if (Array.isArray(valueSlot)) {
    //@ts-ignore TODO gotta figure out later if this can be resolved properly by TS lol.
    element.addEventListener(attributeName, ...valueSlot);
  } else {
    //@ts-ignore TODO gotta figure out later if this can be resolved properly by TS lol.
    element.addEventListener(attributeName, valueSlot);
  }
};
