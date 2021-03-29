import { Component, xml } from "/dist/mod.js";

export class AsyncComponent extends Component {
  template = xml`
    foo
    <slot />
    bar
  `;
}
