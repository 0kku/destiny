import { Component, html, Ref } from "/dist/mod.js";

import { inputStyles } from "../inputStyles.js";

/**
 * An example of a component that forwards its props to a child.
 */
export default class TextField extends Component {
  forwardProps = new Ref;
  static captureProps = true;
  static styles = inputStyles;

  template = html`
    <input type="text" destiny:ref=${this.forwardProps} />
  `;
}
