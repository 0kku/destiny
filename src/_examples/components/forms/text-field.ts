import { Component, html, Ref } from "/dist/mod.js";

import { inputStyles } from "../inputStyles.js";

/**
 * An example of a component that forwards its props to a child.
 */
export default class TextField extends Component {
  override forwardProps = new Ref;
  static override captureProps = true;
  static override styles = inputStyles;

  override template = html`
    <input type="text" destiny:ref=${this.forwardProps} />
  `;
}
