import { DestinyElement, html, reactive } from "../Destiny/_Destiny.js";

customElements.define("visitor-demo", class extends DestinyElement {
  #who = reactive("visitor");
  #count = reactive(0);
  #timer = setInterval(() => {
    this.#count.value++;
  }, 1e3);

  disconnectedCallback () {
    clearInterval(this.#timer);
  }

  render() {
    return html`
      <label>What's your name? <input type=text value=${this.#who}></label>
      <p>
        Hello, ${this.#who}! You arrived ${this.#count} seconds ago.
      </p>
    `;
  }
});
