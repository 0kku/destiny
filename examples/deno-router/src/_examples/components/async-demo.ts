
import { Component, html } from "../../mod.ts";

export default class AsyncDemo extends Component {
  #AsyncComponent = import("./async-component.ts");

  override template = html`
    This is not a super exciting demo to look at — I'll cook up a nicer async demo later.
    <br />
    <${import("./forms/text-field.ts")} value="testing" />
    <br />
    <${this.#AsyncComponent}>
      Qux
    </${this.#AsyncComponent}>
  `;
}
