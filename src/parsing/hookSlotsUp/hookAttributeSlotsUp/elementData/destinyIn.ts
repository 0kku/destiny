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
export function destinyIn (
  value: unknown,
  element: HTMLElement,
): void {
  if (!(value instanceof Function)) {
    throw new TypeError("Value of destiny:in must be a function");
  }
  queueMicrotask( // wait for stack to clear
    () => queueMicrotask( // let other microtasks run first
      () => void value(element),
    ),
  );
}
