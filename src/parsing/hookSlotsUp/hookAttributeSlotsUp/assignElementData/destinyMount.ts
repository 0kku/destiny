/**
 * `destiny:mount` takes a callback function, which will be called 
 * once the element has been created.
 * 
 * Example usage: 
 * ```html
 * <div destiny:mount=${
 *   element => element.animate(
 *     [{opacity: 0}, {height: 1}],
 *     {duration: 300, fill: "forwards"},
 *   ).play()
 * }> This will fade in! </div>
 * ```
 */
export function destinyMount (
  element: HTMLElement,
  value: unknown,
): void {
  if (!(value instanceof Function)) {
    throw new TypeError("Value of destiny:mount must be a function");
  }
  queueMicrotask( // wait for stack to clear
    () => queueMicrotask( // let other microtasks run first
      () => void value(element),
    ),
  );
}
