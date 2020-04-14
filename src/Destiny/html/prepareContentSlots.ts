import { IUnpreparedContentSlot } from "./interfaces";

function createPlaceholder (
  index: number,
) {
  const placeholder = document.createElement("template");
  placeholder.setAttribute("destiny:content", String(index));
  return placeholder;
}

export function prepareContentSlots(
  contentSlots: IUnpreparedContentSlot[],
) {
  return contentSlots.flatMap(contentSlot => {
    const raw = contentSlot.node.textContent ?? "";
    const nodes = contentSlot.slots.flatMap((slot, i, a) => [
      new Text(raw.slice(a[i - 1]?.end ?? 0, slot.start)),
      createPlaceholder(slot.index),
    ]);
    contentSlot.node.replaceWith(
      ...nodes,
      new Text(raw.slice(contentSlot.slots.pop()?.end)),
    );
  });
}
