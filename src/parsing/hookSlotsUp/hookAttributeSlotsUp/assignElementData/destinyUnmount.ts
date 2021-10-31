import { deferredElements } from "../../../deferredElements.js";

/**
 * `destiny:unmount` takes a callback function which will be called
 * when the element is about to be removed from DOM. If the 
 * callback returns a promise, that promise will be awaited on
 * and the element is removed once it resolves.
 * 
 * Example usage: 
 * ```html
 * <div destiny:unmount=${
 *   element => {
 *     const anim = element.animate(
 *       [{opacity: 0}, {height: 1}],
 *       {duration: 300, fill: "forwards"},
 *     );
 *     anim.play();
 *     return anim.finished; // Element is removed once the animation finishes 
 *   }
 * }> This will fade out! </div>
 * ```
 */
export function destinyUnmount (
  element: HTMLElement,
  value: unknown,
): void {
  deferredElements.set(
    element,
    value as () => Promise<void>,
  );
}
