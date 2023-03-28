import { Component, html } from "../../mod.ts";

export default class AsyncComponent extends Component {
  override template = html`
    foo
    <slot />
    bar
  `;
}
