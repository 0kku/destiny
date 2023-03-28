import { deferredElements } from "./deferredElements.ts";
import { TemplateResult } from "./TemplateResult.ts";
import type { Component } from "../componentLogic/Component.ts";

/** A counter for labling `Comment`s for `Slot`s. */
let counter = 0;

/**
 * Keeps track of sequences of DOM nodes that have been inserted into the document. For example, when a `DocumentFragment` is inserted, it may have multiple top-level elements which need to be prevented from merging with adjescent elements (in the case of `Text` nodes) and need to be removable when the state is updated.
 */
export class Slot {
  #id = counter++;
  #startAnchor = new Comment(`<DestinySlot(${this.#id})>`);
  #endAnchor = new Comment(`</DestinySlot(${this.#id})>`);
  #nodes: Array<ChildNode>;

  /**
   * @param placeholderNode A `Node` which is used as a "bookmark" of where in the DOM the `Slot`'s content should be inserted
   * @param content Initial content to be inserted into the slot
   */
  constructor(
    placeholderNode: ChildNode,
    content?: TemplateResult | DocumentFragment,
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

  replaceItem(
    whatToReplace: ChildNode,
    ...nodes: Array<string | Node>
  ): void {
    const location = this.#nodes.indexOf(whatToReplace);
    if (location < 0) throw new Error("Can't replace an item that isn't here.");
    const newNodes = nodes.flatMap(
      (v) => (
        typeof v === "string"
          ? new Text(v)
          : v instanceof DocumentFragment
          ? [...v.childNodes]
          : v
      ),
    ) as Array<ChildNode>;
    this.#brandNodes(newNodes);
    whatToReplace.before(...newNodes);
    void this.#disposeNodes([whatToReplace]);

    this.#nodes.splice(
      location,
      1,
      ...newNodes,
    );
  }

  #brandNodes(
    nodes: Array<ChildNode>,
  ): void {
    (nodes as Array<Component>)
      .forEach((node) => node.destinySlot = this);
  }

  /**
   * Updates the content of the slot with new content
   * @param fragment New content for the slot
   */
  update(
    input: TemplateResult | DocumentFragment,
  ): void {
    const fragment = input instanceof TemplateResult ? input.content : input;
    void this.#disposeCurrentNodes();
    this.#nodes = Object.values(fragment.childNodes);
    this.#brandNodes(this.#nodes);
    this.#endAnchor.before(fragment);
  }

  async #disposeNodes(
    nodesToDisposeOf: Array<ChildNode>,
  ): Promise<void> {
    await Promise.all(
      (nodesToDisposeOf as Array<HTMLElement>).map(
        (node) => deferredElements.get(node)?.(node),
      ),
    );
    for (const node of nodesToDisposeOf) {
      node.remove();
    }
  }

  /**
   * First removes all the current nodes from this Slot's list of tracked nodes, then waits for any exit tasks (such as animations) these nodes might have, and removes each node once all the tasks have finished running.
   */
  async #disposeCurrentNodes(): Promise<void> {
    await this.#disposeNodes(
      this.#nodes.splice(
        0,
        this.#nodes.length,
      ),
    );
  }

  /**
   * Removes all the associated content from the DOM and destroys the `Slot`. Note: this is an async function and will wait for any exit animations or other tasks to finish before removing anything. Exit tasks for HTML elements are defined by the `destiny:unmount` attribute; if the callback function given to it returns a `Promise`, that's what's being awaited before removal.
   */
  async remove(): Promise<void> {
    await this.#disposeCurrentNodes();
    this.#startAnchor.remove();
    this.#endAnchor.remove();
  }

  /**
   * Inserts one or more `Node`s into the DOM before the start of the `Slot`.
   * @param nodes
   */
  insertBeforeThis(
    ...nodes: Array<Node>
  ): void {
    this.#startAnchor.before(
      ...nodes,
    );
  }
}
