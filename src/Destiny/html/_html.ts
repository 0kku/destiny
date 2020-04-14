import { createTemplateObject } from "./createTemplateObject.js";
import { hookSlotsUp } from "./hookSlotsUp/hookSlotsUp.js";

const templateCache = new WeakMap<
  TemplateStringsArray,
  HTMLTemplateElement
>();

export function html (
  strings: TemplateStringsArray,
  ...props: unknown[]
) {
  let template = templateCache.get(strings);

  if (!template) {
    templateCache.set(
      strings,
      template = createTemplateObject(strings),
    );
  };

  const content = template.content.cloneNode(true) as DocumentFragment;

  hookSlotsUp(
    content,
    props,
  );

  return content;
}
