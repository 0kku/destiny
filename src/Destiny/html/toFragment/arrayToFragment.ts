import { IPropBottom } from "../interfaces.js";

export function arrayToFragment (
  nodes: IPropBottom[],
) {
  const fragment = document.createDocumentFragment();
  console.log(...nodes);
  fragment.append(...nodes);
  console.log(fragment);
  return fragment;
}
