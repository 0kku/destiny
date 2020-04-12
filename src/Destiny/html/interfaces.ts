import { ReactivePrimitive } from "../_Destiny.js";

export interface IUnpreparedContentSlot {
  node: Text,
  slots: Array<{
    index: number,
    start: number,
    end: number,
  }>,
}

export interface IContentSlot {
  node: ChildNode,
  index: number,
  replace: (fragment: DocumentFragment) => void,
}

export interface IAttributeSlot {
  name: string;
  node: HTMLElement;
  index: number;
}

export interface ITemplateObject {
  template: HTMLTemplateElement,
  slots: [
    Array<IAttributeSlot>,
    Array<IUnpreparedContentSlot>,
  ],
}

export type IPropBottom = Node | DocumentFragment | string;
export type IProp = IPropBottom | IPropBottom[] | ReactivePrimitive<IPropBottom>;
