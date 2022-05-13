import { Component, css, html, reactive } from "../../../mod.ts";

import TaskItem from "./task-item.ts";
import { animateIn, animateOut } from "./animations.ts";
import { inputStyles } from "../inputStyles.ts";

type TInputChangeEvent = InputEvent & {
  currentTarget: HTMLInputElement;
};

export default class Todo extends Component {
  #newValue = reactive("");
  #items = reactive([
    {
      title: "Pet a cat",
      done: true,
      editing: false,
    },
    {
      title: "Catch all Pokémon",
      done: false,
      editing: false,
    },
    {
      title: "Travel the world",
      done: false,
      editing: false,
    },
  ]);

  static override styles = [
    inputStyles,
    css`
      ul {
        list-style: none;
      }

      li {
        height: var(--l);
        overflow: hidden;
        font-size: var(--m);
        padding-bottom: var(--xs);
      }


      ${TaskItem} {
        display: block;
        height: var(--l);
        overflow: hidden;
      }
    `,
  ];

  override template = html`
    <h1>${
    this.#items.filter((v) => v.done.value).length
  }/${this.#items.length} tasks compelete</h1>
    <ul>
      ${
    this.#items.map((item, i) =>
      html`
        <${TaskItem}
          prop:item=${item}
          prop:removeItem=${() => this.#items.splice(i.value, 1)}
          destiny:mount=${animateIn}
          destiny:unmount=${animateOut}
        />
      `
    )
  }
      ${
    this.#items.length.falsy(html`
        <li
          destiny:mount=${animateIn}
          destiny:unmount=${animateOut}
        >
          <i>No items to show</i>
        </li>
      `)
  }
      <li>
        <form
          id="add-task"
          on:submit=${(e: Event) => {
    e.preventDefault();
    this.#items.push({
      title: this.#newValue.value,
      done: false,
      editing: false,
    });
    this.#newValue.value = "";
  }}
        >
          <input
            type="text"
            prop:value=${this.#newValue}
            required=""
            placeholder="Add an item..."
            aria-label="Add an item"
          />
          <input type="submit" value="➕" />
        </form>
      </li>
    </ul>
    <label>
      <input
        type="checkbox"
        class="check-all"
        prop:checked=${this.#items.every((item) => item.done.value)}
        prop:indeterminate=${
    this.#items.exclusiveSome((item) => item.done.value)
  }
        on:change=${(e: TInputChangeEvent) => {
    this.#items.value.forEach((item) => {
      item.done.value = e.currentTarget.checked;
    });
  }}
      />
      Check all
    </label>
    <input
      type="button"
      value="Clear done"
      on:click=${() => this.#items.mutFilter((v) => !v.done.value)}
    />
  `;
}
