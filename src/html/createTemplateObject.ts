import { resolveSlots } from "./resolveSlots.js";

/**
 * Parses and processes a `TemplateStringsArray` into a `DocumentFragment`.
 * @param param0 The template strings to parse and process
 */
export function createTemplateObject (
  [first, ...strings]: TemplateStringsArray,
) {
  const temp = document.createElement("template");
  let string = first;
  for (const [i, fragment] of strings.entries()) {
    string += `__internal_${i}_${fragment}`;
  }
  temp.innerHTML = string;

  resolveSlots(temp);

  return temp;
}
