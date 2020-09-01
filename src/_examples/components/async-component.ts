import { DestinyElement, xml } from "/dist/mod.js";

export class AsyncComponent extends DestinyElement {
  template = xml/*html*/`
    foo
    <slot />
    bar
  `;
}
