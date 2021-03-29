import { Component, xml, Ref } from "/dist/mod.js";

/**
 * An example of a component that forwards its props to a child.
 */
export class TextField extends Component {
  forwardProps = new Ref;
  static captureProps = true;

  template = xml`
    <input type="text" destiny:ref="${this.forwardProps}" />
  `;
}
