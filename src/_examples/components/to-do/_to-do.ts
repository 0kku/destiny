import { Component, xml, reactive } from "/dist/mod.js";

import { animateIn, animateOut } from "./animations.js";
import { TaskItem } from "./task-item.js";

type TInputChangeEvent = InputEvent & {
  currentTarget: HTMLInputElement,
};

export class Todo extends Component {
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

  template = xml/*html*/`
    <style>
      label {
        height: var(--l);
        line-height: var(--l);
      }

      label, [type=button], [type=submit] {
        cursor: pointer;
        color: white;
      }

      li {
        height: var(--l);
        overflow: hidden;
        font-size: var(--m);
      }

      input:not([type=checkbox]) {
        color: white;
        text-shadow: 1px 1px 1px rgba(0,0,0,.7);
        vertical-align: top;
        box-sizing: border-box;
        min-width: var(--xl);
        height: var(--l);
        padding: 0 var(--s);
        background: var(--element-color);
        border-radius: var(--border-radius);
        box-shadow: 0 1px 1px rgba(0,0,0,.4);
        outline: none;
        transition: all .1s;
        border: 1px solid transparent;
        font-size: var(--m);
      }
      input:not([type=checkbox]):hover {
        background: var(--element-hover-color);
      }
      input:not([type=checkbox]):active {
        transform: translateY(1px);
      }
      input:not([type=checkbox]):focus {
        border: 1px solid var(--element-focus-color);
      }

      input[type=text] {
        padding: 0 var(--s);
        width: 200px;
        height: var(--l);
        background: var(--element-color);
        border: none;
        outline: none;
        border-radius: var(--border-radius);
      }
      input[type=text]::placeholder {
        font-style: italic;
        color: #333;
        text-shadow: none;
      }

      ${TaskItem} {
        display: block;
        height: var(--l);
        overflow: hidden;
      }
    </style>
    <h1>${this.#items.filter(v => v.done.value).length}/${this.#items.length} tasks compelete</h1>
    <ul>
      ${this.#items.map((item, i) => xml`
        <${TaskItem}
          prop:item="${item}"
          prop:removeItem="${() => this.#items.splice(i.value, 1)}"
          destiny:in="${animateIn}"
          destiny:out="${animateOut}"
        />
      `)}
      ${this.#items.length.falsy(xml`
        <li
          destiny:in="${animateIn}"
          destiny:out="${animateOut}"
        >
          <i>No items to show</i>
        </li>
      `)}
      <li>
        <form
          id="add-task"
          on:submit="${(e: Event) => {
            e.preventDefault();
            this.#items.push({
              title: this.#newValue.value,
              done: false,
              editing: false,
            });
            this.#newValue.value = "";
          }}"
        >
          <input
            type="text"
            prop:value="${this.#newValue}"
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
        prop:checked="${this.#items.every(item => item.done.value)}"
        prop:indeterminate="${this.#items.exclusiveSome(item => item.done.value)}"
        on:change="${(e: TInputChangeEvent) => {
          this.#items.value.forEach(item => {
            item.done.value = e.currentTarget.checked;
          });
        }}"
      />
      Check all
    </label>
    <input
      type="button"
      value="Clear done"
      on:click="${() => this.#items.mutFilter(v => !v.done.value)}"
    />
  `;
}
