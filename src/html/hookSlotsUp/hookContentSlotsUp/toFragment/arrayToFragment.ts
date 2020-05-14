import { IPropBottom } from "../../../interfaces.js";
import { shouldBeRendered } from "../../stringifyValue.js";

/**
 * Converts an array of items into a `DocumentFragment`.
 * @param nodes The items to be converted
 */
export function arrayToFragment (
  nodes: IPropBottom[],
) {
  const fragment = document.createDocumentFragment();

  console.log(...nodes.filter(shouldBeRendered));
  fragment.append(...nodes.filter(shouldBeRendered));
  console.log(fragment);
  return fragment;
}
