import { IPropBottom } from "../../../interfaces.js";
import { shouldBeRendered } from "../../stringifyValue.js";

export function arrayToFragment (
  nodes: IPropBottom[],
) {
  const fragment = document.createDocumentFragment();

  console.log(...nodes.filter(shouldBeRendered));
  fragment.append(...nodes.filter(shouldBeRendered));
  console.log(fragment);
  return fragment;
}
