import { arrayToFragment } from "./arrayToFragment.js";
import { nodeToFragment } from "./nodeToFragment.js";

export function valueToFragment (
  value: unknown,
) {
  let fragment: DocumentFragment;
  if (value instanceof Node) {
    fragment = nodeToFragment(value);
  } else if (value instanceof DocumentFragment) {
    fragment = value;
  } else if (Array.isArray(value)) {
    fragment = arrayToFragment(value);
  } else {
    fragment = nodeToFragment(new Text(String(value)));
  }
  return fragment;
}
