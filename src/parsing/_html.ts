import { parser } from "./parser.js";
import type { TemplateResult } from "./TemplateResult.js";

/**
 * Parses an HTML template into a `TemplateResult` and hooks up reactivity logic to keep the view synchronized with the state of the reactive items prived in the slots.
 * @param strings The straing parts of the template
 * @param props The slotted values in the template
 */
export function html (
  strings: TemplateStringsArray,
  ...props: Array<unknown>
): TemplateResult {
  return parser(strings, props, "html");
}
