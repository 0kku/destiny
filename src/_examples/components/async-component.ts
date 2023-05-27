import { Component, html } from "/dist/mod.js";
import { exampleContext } from "./app-root.js";

export default class AsyncComponent extends Component {
  override template = html`
    foo
    <slot />
    bar

    <blockquote>The context is: ${this.getContext(exampleContext)}</blockquote>
  `;
}
