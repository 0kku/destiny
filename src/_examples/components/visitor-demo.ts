import { DestinyElement, xml, reactive } from "/dist/mod.js";
import type { TemplateResult } from "/dist/mod.js";

import { TextField } from "./forms/text-field.js";

export class VisitorDemo extends DestinyElement {
  #who = reactive("visitor");
  #count = reactive(0);
  #timer = setInterval(() => {
    this.#count.value++;
  }, 1e3);

  disconnectedCallback (): void {
    clearInterval(this.#timer);
  }

  render (): TemplateResult {
    return xml/*html*/`
      <label>What's your name? <input type="text" value="${this.#who}" /></label>
      <p>
        Hello, ${this.#who}! You arrived ${this.#count} seconds ago.
      </p>
      <${TextField} 
        foo="${this.#count}"
        prop:value="${"Test"}"
        on:input="${(e: Event) => console.log("Changed!", e)}"
      ></${TextField}>
    `;
  }
}
