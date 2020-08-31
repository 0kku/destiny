import { register } from "../elementLogic/register.js";
import { parseString } from "./parseString.js";
import { resolveSlots } from "./resolveSlots.js";
import { isDestinyElement } from "../elementLogic/isDestinyElement.js";

/**
 * Parses and processes a `TemplateStringsArray` into a `DocumentFragment`.
 * @param param0 The template strings to parse and process
 */
export function createTemplate (
  [first, ...strings]: TemplateStringsArray,
  props: Array<unknown>,
  parser: "html" | "xml",
): HTMLTemplateElement {
  let string = first;
  for (const [i, fragment] of strings.entries()) {
    const prop = props[i];
    const last = string.substring(string.length - 1);
    string += (
      isDestinyElement(prop)
      ? `${register(prop)}${last === "<" && prop.captureProps ? " data-capture-props=\"true\"" : ""}${fragment}`
      : `__internal_${i}_${fragment}`
    );
  }
  
  const templateElement = parseString(string, parser);

  resolveSlots(templateElement);

  return templateElement;
}
