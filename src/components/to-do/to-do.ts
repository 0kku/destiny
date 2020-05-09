import { DestinyElement, html, reactive } from "../../Destiny/_Destiny.js";
import "./task-item.js";

customElements.define("to-do", class extends DestinyElement {
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

  render () {
    return html`
      <style>
        label, [type=button], [type=submit] {
          cursor: pointer;
        }

        li {
          height: 24px;
          overflow: hidden;
        }

        .task-name, .edit-task [type=text] {
          box-sizing: border-box;
          display: inline-block;
          width: 175px;
        }

        [type=text] {
          box-sizing: border-box;
          width: 200px;
        }

        .edit-task {
          display: inline;
          white-space: nowrap;
        }
      </style>
      <ul>
        ${this.#items.map((item, i) => html`
          <task-item
            prop:item=${item}
            prop:remove-item=${() => this.#items.splice(i.value, 1)}
          ></task-item>
        `)}
        <li>
          <form
            id=add-task
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
            <input type=text prop:value=${this.#newValue} required>
            <input type=submit value=➕>
          </form>
        </li>
      </ul>
      <label>
        <input
          type=checkbox
          class=check-all
          prop:checked=${this.#items.every(item => item.done.value)}
          prop:indeterminate=${this.#items.exclusiveSome(item => item.done.value)}
          on:change=${(e: InputEvent) => {
            this.#items.value.forEach(item => {
              item.done.value = (e.currentTarget as HTMLInputElement)?.checked;
            });
          }}
        >
        Check all
      </label>
    `;
  }
});
