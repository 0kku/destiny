import { Component, html } from "/dist/mod.js";

export class AsyncComponent extends Component {
  template = html`
    foo
    <slot />
    bar
  `;
}
