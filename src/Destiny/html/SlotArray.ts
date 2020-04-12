import { ReactiveArray } from "../_Destiny.js";
import { Slot } from "./Slot.js";

export class SlotArray {
  #startAnchor = new Comment("<DestinyArray>");
  #endAnchor = new Comment("</DestinyArray>");
  // #parent: HTMLElement;
  #source: ReactiveArray<DocumentFragment>; 
  #domArray = [] as Slot[];

  constructor (
    node: ChildNode,
    source: ReactiveArray<DocumentFragment>,
  ) {
    node.replaceWith(
      this.#startAnchor,
      this.#endAnchor,
    );
    // const parent = this.#startAnchor.parentElement;
    // if (!parent) throw new Error("SlotArray initialized with detached ChildNode");
    // this.#parent = parent;

    this.#source = source;
    this.#source.bind(this.update);
  }

  private _insertToDom (
    index: number,
    ...fragments: DocumentFragment[]
  ) {
    fragments.forEach((fragment, i) => {
      const where = i + index;
      const slotPlaceholder = new Comment("Slot placeholder");
      if (!this.#domArray.length || where > this.#domArray.length - 1) {
        this.#endAnchor.replaceWith(slotPlaceholder, this.#endAnchor);
        // this.#parent.insertBefore(slotPlaceholder, this.#endAnchor);
      } else {
        this.#domArray[where].insertBeforeThis(slotPlaceholder);
      }
      this.#domArray.splice(where, 0, new Slot(slotPlaceholder, fragment));
    });
  }

  private _removeFromDom (
    from: number,
    count: number,
  ) {
    const to = Math.min(
      from + count,
      this.#domArray.length,
    );
    for (let i = from; i < to; i++) {
      this.#domArray[i].remove();
    }
    this.#domArray.splice(from, count);
  }

  update = (
    index: number,
    deleteCount: number,
    ...items: DocumentFragment[]
  ) => {
    this._removeFromDom(index, deleteCount);
    this._insertToDom(index, ...items);
  }
}
