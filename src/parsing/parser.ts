import { createTemplate } from "./createTemplate.js";
import { TemplateResult } from "./TemplateResult.js";
import type { TParseResult } from "./TParseResult";

/** Used to cache parsed `DocumentFragment`s so looped templates don't need to be reparsed on each iteration. */
const templateCache = new WeakMap<
  TemplateStringsArray,
  TParseResult
>();

function getFromCache (
  key: TemplateStringsArray,
  set: () => TParseResult,
  props: Array<unknown>,
): HTMLTemplateElement {
  const template = templateCache.get(key);
  if (!template) {
    const newTemplate = set();
    templateCache.set(key, newTemplate);
    return newTemplate[0];
  } else {
    // Check if any of the tags differ from the cache, because they can't be slotted
    for (const [k, v] of template[1]) {
      if (props[k] !== v) return set()[0];
    }
    return template[0];
  }
}

export function parser (
  strings: TemplateStringsArray,
  props: Array<unknown>,
  parser: "xml" | "html",
): TemplateResult {
  const template = getFromCache(
    strings,
    () => createTemplate(strings, props, parser),
    props,
  );

  return new TemplateResult(template, props);
}
