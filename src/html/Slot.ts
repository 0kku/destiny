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
    this._disposeCurrentNodes();
    this.#nodes = Object.values(fragment.childNodes);
    this.#endAnchor.before(fragment);
  }

  /**
   * First removes all the current nodes from this Slot's list of tracked nodes, then waits for any exit tasks (such as animations) these nodes might have, and removes each node once all the tasks have finished running.
   */
  private async _disposeCurrentNodes () {
    const nodesToDisposeOf = this.#nodes.splice(
      0,
      this.#nodes.length,
    ) as HTMLElement[];

    await Promise.all(
      nodesToDisposeOf.map(
        node => deferredElements.get(node)?.(node),
      ),
    );

    for (const node of nodesToDisposeOf) {
      node.remove();
    }
  }

  /**
   * Removes all the associated content from the DOM and destroys the `Slot`. Note: this is an async function and will wait for any exit animations or other tasks to finish before removing anything. Exit tasks for HTML elements are defined by the `destiny:out` attribute; if the callback function given to it returns a `Promise`, that's what's being awaited before removal.
   */
  async remove () {
    await this._disposeCurrentNodes();
    this.#startAnchor.remove();
    this.#endAnchor.remove();
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
