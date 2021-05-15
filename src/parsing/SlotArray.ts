import { Slot } from "./Slot.js";
import type { ReadonlyReactiveArray } from "../mod.js";
import type { TemplateResult } from "./TemplateResult.js";

/**
 * Keeps track of `ReadonlyReactiveArray`s slotted into a template in the DOM. 
 */
export class SlotArray {
  /** A "bookmark" for where in the DOM this `SlotArray` starts */
  #startAnchor = new Comment("<DestinyArray>");

  /** A "bookmark" for where in the DOM this `SlotArray` ends */
  #endAnchor = new Comment("</DestinyArray>");

  /** The original `ReadonlyReactiveArray` this instance is receiving updates from */
  #source: ReadonlyReactiveArray<DocumentFragment>;

  /** All the `Slot`s being tracked by this instance */
  #domArray: Array<Slot> = [];

  /**
   * @param placeholderNode A `Node` which is used as a "bookmark" of where in the DOM the `SlotArray`'s content should be inserted
   * @param source The `ReadonlyReactiveArray` which is being rendered
   */
  constructor (
    placeholderNode: ChildNode,
    source: ReadonlyReactiveArray<DocumentFragment>,
  ) {
    placeholderNode.replaceWith(
      this.#startAnchor,
      this.#endAnchor,
    );

    this.#source = source;
    this.#source.bind(this.update);
  }

  /**
   * Inserts zero or more `DocumentFragment`s into the DOM, and creates `Slot`s out of them to track them.
   * @param index Index at which to insert the items
   * @param fragments the items to be inserted
   */
  #insertToDom (
    index: number,
    ...fragments: Array<DocumentFragment | TemplateResult>
  ): void {
    fragments.forEach((fragment, i) => {
      const where = i + index;
      const slotPlaceholder = new Comment("Destiny slot placeholder");
      if (!this.#domArray.length || where > this.#domArray.length - 1) {
        this.#endAnchor.before(slotPlaceholder);
      } else {
        this.#domArray[where].insertBeforeThis(slotPlaceholder);
      }
      this.#domArray.splice(where, 0, new Slot(slotPlaceholder, fragment));
    });
  }

  /**
   * Removes zero or more `Slot`s from the DOM.
   * @param from Index at which to start removing `Slot`s
   * @param count How many `Slot`s to remove
   */
  #removeFromDom (
    from: number,
    count: number,
  ): void {
    const to = Math.min(
      from + count,
      this.#domArray.length,
    );
    for (let i = from; i < to; i++) {
      void this.#domArray[i].remove();
    }
    this.#domArray.splice(from, count);
  }

  /**
   * Analogous to `ReactiveArray::splice()`. Removes zero or more `Slot`s from DOM, and inserts zero or more new ones.
   * @param index Index at which to start modifying `Slots`
   * @param deleteCount How many `Slot`s to remove
   * @param items Any new items to be inserted into DOM
   */
  update = (
    index: number,
    deleteCount: number,
    ...items: Array<DocumentFragment>
  ): void => {
    this.#removeFromDom(index, deleteCount);
    this.#insertToDom(index, ...items);
  };
}
