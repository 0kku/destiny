import { Component, html } from "../../../mod.ts";
import { inputStyles } from "../inputStyles.ts";

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
