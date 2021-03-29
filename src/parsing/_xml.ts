import { createTemplate } from "./createTemplate.js";
import { TemplateCache } from "./TemplateCache.js";
import { TemplateResult } from "./TemplateResult.js";

const templateCache = new TemplateCache;

/**
 * Parses an XML template into a `TemplateResult` and hooks up reactivity logic to keep the view synchronized with the state of the reactive items prived in the slots.
 * @param strings The straing parts of the template
 * @param props The slotted values in the template
 */
export function xml (
  strings: TemplateStringsArray,
  ...props: Array<unknown>
): TemplateResult {
  const template = templateCache.computeIfAbsent(
    strings,
    () => createTemplate(strings, props),
    props,
  );

  return new TemplateResult(template, props);
}
