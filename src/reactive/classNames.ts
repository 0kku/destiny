import { computed } from "./computed.ts";
import { ReadonlyReactiveValue } from "./ReactiveValue/_ReadonlyReactiveValue.ts";

/**
 * This function can be used to create class name string for one or more class names controlled by static or reactive booleans.
 * 
 * Example usage: 
 * ```js
 * const foo = reactive(true);
 * const bar = reactive(false);
 * 
 * html`
 *   <div
 *     class=${classNames({
 *       foo, // initially added
 *       bar, // initially omitted
 *       baz: true, // will always be added
 *     })}
 *   />
 * `;
 * ```
 * and the result will be: 
 * ```html
 *   <div class="foo baz" />
 * ```
 * 
 * @param input A record containing boolean values indicating if the key should be added in as a class name
 * @returns A reactive string that updates when any of the inputs change
 */
export function classNames (
  input: Record<string, boolean | ReadonlyReactiveValue<boolean>>,
): ReadonlyReactiveValue<string> {
  return computed(() =>
    Object
    .entries(input)
    .filter(([, value]) => 
      value instanceof ReadonlyReactiveValue
      ? value.value
      : value
    )
    .map(([key]) => key)
    .join(" "),
  );
}
