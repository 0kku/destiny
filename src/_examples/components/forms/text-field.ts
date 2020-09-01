import { DestinyElement, html, Ref } from "/dist/mod.js";

/**
 * An example of a component that forwards its props to a child.
 */
export class TextField extends DestinyElement {
  forwardProps = new Ref();
  static captureProps = true;

  template = html`
    <input type="text" destiny:ref="${this.forwardProps}">
  `;
}
