import { resolveSlots } from "./resolveSlots.js";

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