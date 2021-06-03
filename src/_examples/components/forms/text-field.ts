import { inputStyles } from "../inputStyles.ts";
import { Component, xml, Ref } from "../../../mod.ts";

/**
 * An example of a component that forwards its props to a child.
 */
export class TextField extends Component {
  forwardProps = new Ref;
  static captureProps = true;
  static styles = inputStyles;

  template = xml`
    <input type="text" destiny:ref=${this.forwardProps} />
  `;
}
