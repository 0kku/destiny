import { deferredElements } from "./deferredElements.js";

/** A counter for labling `Comment`s for `Slot`s. */
let counter = 0;

/**
 * Keeps track of sequences of DOM nodes that have been inserted into the document. For example, when a `DocumentFragment` is inserted, it may have multiple top-level elements which need to be prevented from merging with adjescent elements (in the case of `Text` nodes) and need to be removable when the state is updated.
 */
export class Slot {
  #id = counter++;
  #startAnchor = new Comment(`<DestinySlot(${this.#id})>`);
  #endAnchor = new Comment(`</DestinySlot(${this.#id})>`);
  #nodes: ChildNode[];

  /**
   * @param placeholderNode A `Node` which is used as a "bookmark" of where in the DOM the `Slot`'s content should be inserted
   * @param content Initial content to be inserted into the slot
   */
  constructor (
    placeholderNode: ChildNode,
    content?: (() => DocumentFragment) | DocumentFragment,
  ) {
    this.#nodes = [placeholderNode];
    placeholderNode.replaceWith(
      this.#startAnchor,
      placeholderNode,
      this.#endAnchor,
    );
    if (content) {
      this.update(content);
    }
  }

  /**
   * Updates the content of the slot with new content
   * @param fragment New content for the slot
   */
  update (
    input: (() => DocumentFragment) | DocumentFragment,
  ) {
    const fragment = input instanceof Function ? input() : input;
    const placeholder = this.#nodes.pop()!;
    for (const node of this.#nodes) node.remove();
    if (!fragment.childNodes.length) {
      fragment.append(new Comment("Destiny empty value"));
    }
    this.#nodes = Object.values(fragment.childNodes);
    placeholder.replaceWith(fragment);
  }

  /**
   * Removes all the associated content from the DOM and destroys the `Slot`. Note: this is an async function and will wait for any exit animations or other tasks to finish before removing anything. Exit tasks for HTML elements are defined by the `destiny:out` attribute; if the callback function given to it returns a `Promise`, that's what's being awaited before removal.
   */
  async remove () {
    await Promise.all(
      this.#nodes.map(node => deferredElements.get(node as HTMLElement)?.(node as HTMLElement))
    );
    for (const node of this.#nodes) {
      node.remove();
    }
    this.#startAnchor.remove();
    this.#endAnchor.remove();
    this.#nodes.splice(0, this.#nodes.length - 1);
  }

  /**
   * Inserts one or more `Node`s into the DOM before the start of the `Slot`.
   * @param nodes 
   */
  insertBeforeThis (
    ...nodes: Node[]
  ) {
    this.#startAnchor.before(
      ...nodes,
    );
  }
}
