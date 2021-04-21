import { isReactive } from "../typeChecks/isReactive.js";
import { CSSTemplate } from "./CSSTemplate.js";
import { composeTemplateString } from "../utils/composeTemplateString.js";

export function css (
  strings: TemplateStringsArray,
  ...props: Array<unknown>
): CSSTemplate {
  if (props.some(v => isReactive(v))) {
    throw new TypeError("CSS templates are not reactive. Instead, use `attachCSSProperty` to synchronize your CSS with your application state.");
  }

  return new CSSTemplate(composeTemplateString(strings, props));
}
