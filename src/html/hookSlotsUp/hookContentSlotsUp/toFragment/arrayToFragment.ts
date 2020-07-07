import { shouldBeRendered } from "../../stringifyValue.js";
import { valueToFragment } from "./valueToFragment.js";

/**
 * Converts an array of items into a `DocumentFragment`.
 * @param values The items to be converted
 */
export function arrayToFragment (
  values: unknown[],
) {
  const fragment = new DocumentFragment;

  fragment.append(
    ...values
    .filter(shouldBeRendered)
    .map(valueToFragment),
  );

  return fragment;
}
