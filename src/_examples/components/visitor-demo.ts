import { Component, xml, reactive } from "/dist/mod.js";

export class VisitorDemo extends Component {
  #who = reactive("visitor");
  #count = reactive(0);
  #timer = setInterval(() => {
    this.#count.value++;
  }, 1e3);

  disconnectedCallback (): void {
    clearInterval(this.#timer);
  }

  template = xml`
    <label>
      What's your name? <input type="text" value="${this.#who}" />
    </label>
    <p>
      Hello, ${this.#who}! You arrived ${this.#count} seconds ago.
    </p>
  `;
}
