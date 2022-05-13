import { isReactive } from "../typeChecks/isReactive.ts";
import { CSSTemplate } from "./CSSTemplate.ts";
import { composeTemplateString } from "../utils/composeTemplateString.ts";

export function css(
  strings: TemplateStringsArray,
  ...props: Array<unknown>
): CSSTemplate {
  if (props.some((v) => isReactive(v))) {
    throw new TypeError(
      "CSS templates are not reactive. Instead, use `attachCSSProperties()` to synchronize your CSS with your application state.",
    );
  }

  return new CSSTemplate(composeTemplateString(strings, props));
}
