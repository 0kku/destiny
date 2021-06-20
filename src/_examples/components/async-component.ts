import { Component, html } from "/dist/mod.js";

export default class AsyncComponent extends Component {
  template = html`
    foo
    <slot />
    bar
  `;
}
