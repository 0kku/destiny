import { Component, html } from "/dist/mod.js";

export default class AsyncDemo extends Component {
  #AsyncComponent = import("./async-component.js");

  override template = html`
    This is not a super exciting demo to look at — I'll cook up a nicer async demo later.
    <br />
    <${import("./forms/text-field.js")} value="testing" />
    <br />
    <${this.#AsyncComponent}>
      Qux
    </${this.#AsyncComponent}>
  `;
}
