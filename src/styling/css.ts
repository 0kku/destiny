import {
  Component,
  CSSTemplate,
} from "../mod.js";

export type TCssTemplateSlot = (
  | string
  | number
  | bigint
  | boolean
  | undefined
  | null
  | typeof Component<object>
  | ReadonlyArray<TCssTemplateSlot>
);

/**
 * Creates a CSSTemplate that produces a CSSStyleSheet from the input on supported browsers and falls back to a <style> element on outdated ones. 
 * 
 * Unfortunately, CSS templates are not reactive due to performance concerns. Instead, use `attachCSSProperties()` to synchronize your CSS with your application state.
 * 
 * Example use:
 * ```ts
 * css`
 *   ${MyComponent} > .example:focus {
 *     font-size: 1.2rem;
 *     ${condition && "color: red;"}
 *   }
 * `;
 * ```
 * Because booleans, undefined, and null are filtered out, one may use the `&&`, `||`, and `??` logical operators to add rules conditionally (**note that this is *not* reactive**). To avoid this behaviour, manually convert them to a string.
 * 
 * @param slots Strings, numbers, and bigints are inserted into the tempalte as strings. Booleans, undefined and null are replaced with an empty string. Instances of Component get their registered name inserted. Arrays are flattened, the same algorithm is used on each item, and the array is joined together.
 */
export function css (
  strings: TemplateStringsArray,
  ...slots: ReadonlyArray<TCssTemplateSlot>
): CSSTemplate {
  return new CSSTemplate(
    strings.reduce(
      (result, string, i) => `${result}${stringifyCssSlot(slots[i - 1])}${string}`,
    ),
  );
}

function stringifyCssSlot (
  input: TCssTemplateSlot,
): string {
  if (Array.isArray(input)) {
    return input.map(stringifyCssSlot).join("");
  } else if (input == null || typeof input === "boolean") {
    return "";
  } else {
    return String(input);
  }
}
