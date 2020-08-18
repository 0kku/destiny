import { isTextNode } from "../typeChecks/isTextNode.js";
import { isElement } from "../typeChecks/isElement.js";
import { prepareContentSlots } from "./prepareContentSlots.js";
import type { TUnpreparedContentSlot } from "./interfaces.js";

/**
 * Figures out from a freshly parsed `HTMLTemplate` where slots are located so they can be quickly hooked up with values.
 * @param template the template element to be processed
 */
export function resolveSlots (
  template: HTMLTemplateElement,
): void {
  const walker = document.createTreeWalker(
    template.content,
    NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_TEXT,
  );
  const contentSlots: Array<TUnpreparedContentSlot> = [];
  while (walker.nextNode()) {
    const node = walker.currentNode;
    if (isTextNode(node)) {
      const matches = node.wholeText.matchAll(
        /__internal_([0-9]+)_/gu,
      ) as IterableIterator<RegExpMatchArray & {index: number}>;
      const fragment = {
        node,
        slots: [...matches].map((match) => ({
          index: Number(match[1]),
          start: match.index,
          end: match.index + match[0].length,
        })),
      };
      if (fragment.slots.length) {
        contentSlots.push(fragment);
      }
    } else if (isElement(node)) {
      for (const {value} of node.attributes) {
        if (value.includes("__internal_")) {
          node.setAttribute("destiny:attr", "");
        }
      }
    }
  }

  prepareContentSlots(contentSlots);
}
