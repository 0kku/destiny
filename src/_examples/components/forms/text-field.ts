import { DestinyElement, html, Ref } from "/dist/mod.js";
import type { TemplateResult } from "/dist/mod.js";

/**
 * An example of a component that forwards its props to a child. Not actually used anywhere currently.
 */
export class TextField extends DestinyElement {
  forwardProps = new Ref();
  static captureProps = true;

  render (): TemplateResult {
    return html`
      <input type="text" destiny:ref="${this.forwardProps}">
    `;
  }
}
