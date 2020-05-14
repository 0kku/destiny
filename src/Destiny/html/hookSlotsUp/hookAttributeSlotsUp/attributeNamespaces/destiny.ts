import { IValueProps } from "../../_hookSlotsUp.js";
import { ReactivePrimitive } from "../../../../mod.js";
import { deferredElements } from "../../../deferredElements.js";

export const destiny = (
  {
    element,
    attributeName,
    valueSlot,
  }: IValueProps,
) => {
  /**
   * `destiny:ref` prop allows you to to give a `ReactivePrimitive` to
   * the templater, which will then store the created element into
   * it once render is complete.
   * 
   * Example usage:
   * ```js
   * const ref = new DestinyPrimitive;
   *
   * ref.pipe(element => {
   *   console.log(element.innerHTML); // "Hello!";
   * })
   *
   * html`
   *   <div destiny:ref=${ref}>Hello!</div>
   * `;
   * ```
   */
  if (attributeName === "ref") {
    if (!(valueSlot instanceof ReactivePrimitive)) {
      throw new TypeError("Ref must be a ReactivePrimitive");
    }
    valueSlot.value = element;
  }

  /**
   * `destiny:in` takes a callback function, which will be called 
   * once the element has been created.
   * 
   * Example usage: 
   * ```html
   * <div destiny:in=${
   *   element => element.animate(
   *     [{opacity: 0}, {height: 1}],
   *     {duration: 300, fill: "forwards"},
   *   ).play()
   * }> This will fade in! </div>
   * ```
   */
  else if (attributeName === "in") {
    if (!(valueSlot instanceof Function)) {
      throw new TypeError("Value of destiny:in must be a function");
    }
    queueMicrotask( // wait for stack to clear
      () => queueMicrotask( // let other microtasks run first
        () => valueSlot(element),
      ),
    );
  }

  /**
   * `destiny:out` takes a callback function which will be called
   * when the element is about to be removed from DOM. If the 
   * callback returns a promise, that promise will be awaited on
   * and the element is removed once it resolves.
   * 
   * Example usage: 
   * ```html
   * <div destiny:in=${
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
  else if (attributeName === "out") {
    deferredElements.set(
      element,
      valueSlot as () => Promise<void>,
    );
  }
}
