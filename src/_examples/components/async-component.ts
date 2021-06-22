import { Component, html } from "/dist/mod.js";

export default class AsyncComponent extends Component {
  override template = html`
    foo
    <slot />
    bar
  `;
}
