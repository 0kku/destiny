import type { TParseResult } from "./TParseResult.ts";

/** Used to cache parsed `DocumentFragment`s so looped templates don't need to be reparsed on each iteration. */
export class TemplateCache extends WeakMap<
  TemplateStringsArray,
  TParseResult
> {
  computeIfAbsent (
    key: TemplateStringsArray,
    set: () => TParseResult,
    props: Array<unknown>,
  ): HTMLTemplateElement {
    const template = this.get(key);
    if (!template) {
      const newTemplate = set();
      this.set(key, newTemplate);
      return newTemplate[0];
    } else {
      // Check if any of the tags differ from the cache, because they can't be slotted
      for (const [k, v] of template[1]) {
        if (props[k] !== v) return set()[0];
      }
      return template[0];
    }
  }
}
