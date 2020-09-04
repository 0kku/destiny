import { parseString } from "./parseString.js";
import { resolveSlots } from "./resolveSlots.js";
import { isDestinyElement } from "../elementLogic/isDestinyElement.js";
import { DestinyFallback } from "../elementLogic/DestinyFallback.js";
import type { TParseResult } from "./TParseResult.js";

/**
 * Parses and processes a `TemplateStringsArray` into a `DocumentFragment`.
 * @param param0 The template strings to parse and process
 */
export function createTemplate (
  [first, ...strings]: TemplateStringsArray,
  props: Array<unknown>,
  parser: "html" | "xml",
): TParseResult {
  let string = first;
  const tagProps = new Map<number, unknown>();
  for (const [i, fragment] of strings.entries()) {
    const prop = props[i];

    if (string.endsWith("<")) {
      tagProps.set(i, prop);
      if (isDestinyElement(prop) && prop.captureProps) {
        string += `${prop.register()} data-capture-props="true"${fragment}`;
      } else if (prop instanceof Promise) {
        string += `${DestinyFallback.register()} prop:for="__internal_${i}_" data-capture-props="true"${fragment}`;
      } else {
        string += String(prop) + fragment;
      }
    } else if (string.endsWith("</")) {
      tagProps.set(i, prop);
      if (prop instanceof Promise) {
        string += DestinyFallback.register() + fragment;
      } else {
        string += String(prop) + fragment;
      }
    } else {
      string += `__internal_${i}_${fragment}`;
    }
  }
  
  const templateElement = parseString(string, parser);

  resolveSlots(templateElement);

  return [templateElement, tagProps];
}
