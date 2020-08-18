import { ReactivePrimitive } from "../mod.js";

export type TUnpreparedContentSlot = {
  node: Text,
  slots: Array<{
    index: number,
    start: number,
    end: number,
  }>,
};

export type TContentSlot = {
  node: ChildNode,
  index: number,
  replace: (fragment: DocumentFragment) => void,
};

export type TAttributeSlot = {
  name: string,
  node: HTMLElement,
  index: number,
};

export type TTemplateObject = {
  template: HTMLTemplateElement,
  slots: [
    Array<TAttributeSlot>,
    Array<TUnpreparedContentSlot>,
  ],
};

export type TPropBottom = Node | DocumentFragment | string;
export type TProp = TPropBottom | Array<TPropBottom> | ReactivePrimitive<TPropBottom>;
