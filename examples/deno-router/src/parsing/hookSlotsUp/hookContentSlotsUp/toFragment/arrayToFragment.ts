import { shouldBeRendered } from "../../stringifyValue.ts";
import { valueToFragment } from "./valueToFragment.ts";

/**
 * Converts an array of items into a `DocumentFragment`.
 * @param values The items to be converted
 */
export function arrayToFragment (
  values: Array<unknown>,
): DocumentFragment {
  const fragment = new DocumentFragment;

  fragment.append(
    ...values
    .filter(shouldBeRendered)
    .map(valueToFragment),
  );

  return fragment;
}
