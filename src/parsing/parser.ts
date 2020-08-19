import { createTemplate } from "./createTemplate.js";
import { TemplateResult } from "./TemplateResult.js";

/** Used to cache parsed `DocumentFragment`s so looped templates don't need to be reparsed on each iteration. */
const templateCache = new WeakMap<
  TemplateStringsArray,
  HTMLTemplateElement
>();

export function parser (
  strings: TemplateStringsArray,
  props: Array<unknown>,
  parser: "xml" | "html",
): TemplateResult {
  let template = templateCache.get(strings);

  if (!template) {
    templateCache.set(
      strings,
      template = createTemplate(strings, props, parser),
    );
  }

  return new TemplateResult(template, props);
}
