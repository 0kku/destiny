import { Component, html } from "/dist/mod.js";

import { inputStyles } from "../inputStyles.js";

/**
 * An example of a component that forwards its props to a child.
 */
export default class TextField extends Component {
  static override captureProps = true;
  static override styles = inputStyles;

  override template = html`
    <input type="text" destiny:data=${this.elementData} />
  `;
}
