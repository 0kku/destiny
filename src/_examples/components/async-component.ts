import { Component, xml } from "../../mod.ts";

export class AsyncComponent extends Component {
  template = xml`
    foo
    <slot />
    bar
  `;
}
