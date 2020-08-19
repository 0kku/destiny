import { DestinyElement, html, reactive } from "/dist/mod.js";
import type { TemplateResult } from "/dist/mod.js";

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
    return html`
      <label>What's your name? <input type=text value=${this.#who}></label>
      <p>
        Hello, ${this.#who}! You arrived ${this.#count} seconds ago.
      </p>
    `;
  }
}
