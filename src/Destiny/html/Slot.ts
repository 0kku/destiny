let counter = 0;
export class Slot {
  #id = counter++;
  #startAnchor = new Comment(`<DestinySlot(${this.#id})>`);
  #endAnchor = new Comment(`</DestinySlot(${this.#id})>`);
  #nodes: ChildNode[];
  // #parent: HTMLElement;

  constructor (
    placeholderNode: ChildNode,
    content?: DocumentFragment,
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

    // const parent = this.#nodes[0].parentElement;
    // const parent = this.#nodes[0].getRootNode();
    // console.log(parent, this.#nodes, this.#nodes[0].getRootNode());
    // if (!parent) throw new Error("Can't find Slot's parent");
    // this.#parent = parent;
  }

  update (
    fragment: DocumentFragment,
  ) {
    const placeholder = this.#nodes.pop()!;
    for (const node of this.#nodes) node.remove();
    if (!fragment.childNodes.length) {
      fragment.append(new Comment("Destiny empty value"));
    }
    this.#nodes = Object.values(fragment.childNodes);
    placeholder.replaceWith(fragment);
  }

  remove () {
    for (const node of this.#nodes) {
      node.remove();
    }
    this.#startAnchor.remove();
    this.#endAnchor.remove();
    this.#nodes.splice(0, this.#nodes.length - 1);
  }

  insertBeforeThis (
    ...nodes: Node[]
  ) {
    this.#startAnchor.replaceWith(...nodes, this.#startAnchor);
    // for (const node of nodes) {
    //   // this.#startAnchor.insertAdjacentElement
    //   this.#parent.insertBefore(node, this.#startAnchor);
    // }
  }

  // insertAfterThis (
  //   ...nodes: Node[]
  // ) {
  //   for (const node of nodes) {
  //     this.#parent.insertBefore(
  //       node,
  //       this.#endAnchor.nextSibling,
  //     );
  //   }
  // }
}
