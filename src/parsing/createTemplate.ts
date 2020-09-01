import { register } from "../elementLogic/register.js";
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
      if (isDestinyElement(prop)) {
        string += register(prop, false);
        if (prop.captureProps) {
          string += " data-capture-props=\"true\"";
        }
        string += fragment;
      } else if (prop instanceof Promise) {
        string += `${register(DestinyFallback, false)} prop:for="__internal_${i}_" data-capture-props="true"${fragment}`;
      } else {
        string += String(prop) + fragment;
      }
    } else if (string.endsWith("</")) {
      tagProps.set(i, prop);
      if (isDestinyElement(prop)) {
        string += register(prop, false) + fragment;
      } else if (prop instanceof Promise) {
        string += register(DestinyFallback, false) + fragment;
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
