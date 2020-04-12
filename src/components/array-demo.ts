import { DestinyElement, html, reactive } from "../Destiny/_Destiny.js";

const randomColor = () => (
  "#" + 
  Math
  .floor(Math.random() * 2**24)
  .toString(16)
  .padStart(6, "0")
);

customElements.define("array-demo", class extends DestinyElement {
  #items = reactive(Array.from({length: 256}, randomColor));
  frame = () => {
    this.#items.splice(
      Math.floor(Math.random() * this.#items.length.value),
      1,
      randomColor(),
    );
    this.#timer = requestAnimationFrame(this.frame);
  }
  #timer = requestAnimationFrame(this.frame);
  // #timer = setInterval(() => {
  //   this.#items.splice(
  //     Math.floor(Math.random() * this.#items.length.value),
  //     1,
  //     randomColor(),
  //   );
  // }, 1);

  disconnectedCallback () {
    // clearInterval(this.#timer);
    cancelAnimationFrame(this.#timer);
  }

  render() {
    return html`
      <style>
        ul {
          list-style: none;
          padding: 0;
          display: flex;
          flex-direction: row;
          flex-wrap: wrap;
        }

        li {
          display: block;
          width: 32px;
          height: 32px;
          text-align: center;
          line-height: 32px;
          margin: 4px;
          border-radius: 3px;
          text-shadow: 1px 1px 3px rgba(0,0,0,.5);
          box-shadow: 1px 1px 3px rgba(0,0,0,.5);
          font-family: monospace;
        }
      </style>
      <ul>
        ${this.#items.map((text, i) => html`
          <li style=${`background-color: ${text};`}>${i}</li>
        `)}
      </ul>
    `;
  }
});