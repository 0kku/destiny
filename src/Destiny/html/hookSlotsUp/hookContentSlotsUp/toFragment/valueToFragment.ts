import { arrayToFragment } from "./arrayToFragment.js";
import { nodeToFragment } from "./nodeToFragment.js";
import { stringifyValue } from "../../stringifyValue.js";

/**
 * A polymorphic helper which figures out the type of the input and determines a suitable way to convert it into a `DocumentFragment`.
 * @param value The item to be converted into a `DocumentFragment`
 */
export function valueToFragment (
  value: unknown,
) {
  if (value instanceof Function) value = value();
  if (value instanceof Node) {
    return nodeToFragment(value);
  } else if (value instanceof DocumentFragment) {
    return value;
  } else if (Array.isArray(value)) {
    return arrayToFragment(value);
  } else {
    return nodeToFragment(new Text(stringifyValue(value)));
  }
}
