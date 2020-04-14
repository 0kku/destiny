import { arrayToFragment } from "./arrayToFragment.js";
import { nodeToFragment } from "./nodeToFragment.js";
import { stringifyValue } from "../../stringifyValue.js";

export function valueToFragment (
  value: unknown,
) {
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
