import { arrayToFragment } from "./arrayToFragment.ts";
import { nodeToFragment } from "./nodeToFragment.ts";
import { stringifyValue } from "../../stringifyValue.ts";
import { TemplateResult } from "../../../TemplateResult.ts";

/**
 * A polymorphic helper which figures out the type of the input and determines a suitable way to convert it into a `DocumentFragment`.
 * @param value The item to be converted into a `DocumentFragment`
 */
export function valueToFragment (
  value: unknown,
): DocumentFragment {
  if (value instanceof TemplateResult) {
    return value.content;
  } else if (value instanceof DocumentFragment) {
    return value;
  } else if (value instanceof Node) {
    return nodeToFragment(value);
  } else if (Array.isArray(value)) {
    return arrayToFragment(value);
  } else {
    return nodeToFragment(
      new Text(
        stringifyValue(value),
      ),
    );
  }
}
