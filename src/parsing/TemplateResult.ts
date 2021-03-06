import { hookSlotsUp } from "./hookSlotsUp/_hookSlotsUp.js";
import { Renderable } from "./Renderable.js";

export class TemplateResult extends Renderable {
  #template: HTMLTemplateElement;
  #props: Array<unknown>;

  constructor (
    template: HTMLTemplateElement,
    props: Array<unknown>,
  ) {
    super();
    this.#template = template;
    this.#props = props;
  }

  get content (): DocumentFragment {
    const content = this.#template.content.cloneNode(true) as DocumentFragment;

    hookSlotsUp(
      content,
      this.#props,
    );

    return content;
  }
}
