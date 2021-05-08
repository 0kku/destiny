import { Component, reactive, xml, css, computed } from "/dist/mod.js";

const randomColor = () => (
  "#" + 
  Math
  .floor(Math.random() * 2**24)
  .toString(16)
  .padStart(6, "0")
);

export class ArrayDemo extends Component {
  #items = reactive(Array.from({length: 256}, randomColor));
  frame = (): void => {
    const randomIndex = Math.floor(
      Math.random() * this.#items.length.value,
    );
    this.#items.set(randomIndex, randomColor());
    this.#timer = requestAnimationFrame(this.frame);
  };
  #timer = requestAnimationFrame(this.frame);

  disconnectedCallback (): void {
    cancelAnimationFrame(this.#timer);
  }

  static styles = css`
    ul {
      list-style: none;
      padding: 0;
      display: flex;
      flex-direction: row;
      flex-wrap: wrap;
    }

    li {
      display: block;
      width: var(--l);
      height: var(--l);
      text-align: center;
      line-height: var(--l);
      margin: var(--xs);
      border-radius: var(--border-radius);
      text-shadow: 1px 1px 3px rgba(0, 0, 0, .5);
      box-shadow: 1px 1px 3px rgba(0, 0, 0, .5);
      font-family: monospace;
    }
  `;

  template = xml`
    <ul>
      ${this.#items.map((text, i) => xml`
        <li style="${computed`background-color: ${text};`}">
          ${i}
        </li>
      `)}
    </ul>
  `;
}
