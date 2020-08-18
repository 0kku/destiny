import { parseString } from "./parseString.js";
import { resolveSlots } from "./resolveSlots.js";

/**
 * Parses and processes a `TemplateStringsArray` into a `DocumentFragment`.
 * @param param0 The template strings to parse and process
 */
export function createTemplate (
  [first, ...strings]: TemplateStringsArray,
  parser: "html" | "xml",
): HTMLTemplateElement {
  let string = first;
  for (const [i, fragment] of strings.entries()) {
    string += `__internal_${i}_${fragment}`;
  }
  const templateElement = parseString(string, parser);

  resolveSlots(templateElement);

  return templateElement;
}
