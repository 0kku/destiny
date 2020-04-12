import { DestinyElement, html, reactive, ReactivePrimitive } from "../Destiny/_Destiny.js";
import "./to-do.js";
import "./visitor-demo.js";
import "./array-demo.js";
import "./time-diff.js";

customElements.define("tab-view", class extends DestinyElement {
  #selected = reactive(0);
  #tabs = reactive([
    {
      title: "Visitor demo",
      content: () => html`<visitor-demo></visitor-demo>`,
    },
    {
      title: "Todo",
      content: () => html`<to-do></to-do>`,
    },
    {
      title: "Array demo",
      content: () => html`<array-demo></array-demo>`,
    },
    {
      title: "Time difference",
      content: () => html`<time-diff></time-diff>`,
    },
  ]);

  render() {
    console.log(
      this.#selected.value,
      this.#tabs,
      this.#tabs[0],
      this.#tabs[this.#selected.value],
      this.#tabs[this.#selected.value].content,
    );
    return html`
      <style>
        :host {
          --m: 16px;
          --s: 8px;
        }
        ul {
          padding: 0;
          padding-left: var(--m);
          display: flex;
          margin: 0;
        }
        li {
          list-style: none;
          padding: var(--s) var(--m);
          border-top-left-radius: 3px;
          border-top-right-radius: 3px;
          transition: background .2s;
          user-select: none;
        }

        li:not(.selected):hover {
          background: rgba(255, 255, 255, .05);
          cursor: pointer;
        }

        .selected, main {
          background: rgba(255,255,255,.1);
        }

        main {
          padding: var(--m);
          border-radius: 3px;
        }
      </style>
      <ul>
        ${this.#tabs.map((tab, i) => html`
          <li
            @onclick=${() => this.#selected.value = i.value}
            class=${ReactivePrimitive.from(
              (i, selected) => i.value === selected.value && "selected",
              i,
              this.#selected,
            )}
          >${tab.title}</li>
        `)}
      </ul>
      <main>
        ${this.#selected.pipe(selected => html`
          ${this.#tabs[selected.value].content.value()}
        `)}
      </main>
    `;
  }
});
