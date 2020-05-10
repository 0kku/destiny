import { DestinyElement, html, reactive } from "../../Destiny/_Destiny.js";
import { animateIn, animateOut } from "./animations.js";
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
          height: 32px;
          overflow: hidden;
          font-size: 15px;
        }

        input:not([type=checkbox]) {
          vertical-align: top;
          box-sizing: border-box;
          width: 40px;
          height: 30px;
          background: #666;
          border: none;
          border-radius: 3px;
          box-shadow: 0 1px 1px rgba(0,0,0,.4);
          outline: none;
          transition: all .1s;
          border: 1px solid transparent;
          font-size: 15px;
        }
        input:not([type=checkbox]):hover {
          background: #777;
        }
        input:not([type=checkbox]):active {
          transform: translateY(1px);
        }
        input:not([type=checkbox]):focus {
          border: 1px solid #999;
        }

        input[type=text] {
          color: white;
          text-shadow: 1px 1px 1px rgba(0,0,0,.7);
          padding: 0 6px;
          width: 200px;
          height: 30px;
          background: #666;
          border: none;
          outline: none;
          border-radius: 3px;
        }

        task-item {
          display: block;
          height: 32px;
          overflow: hidden;
        }
      </style>
      <h1>${this.#items.filter(v => v.done.value).length}/${this.#items.length} tasks compelete</h1>
      <ul>
        ${this.#items.map((item, i) => html`
          <task-item
            prop:item=${item}
            prop:remove-item=${() => this.#items.splice(i.value, 1)}
            destiny:in=${animateIn}
            destiny:out=${animateOut}
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
          on:change=${(e: InputEvent & {currentTarget: HTMLInputElement}) => {
            this.#items.value.forEach(item => {
              item.done.value = e.currentTarget.checked;
            });
          }}
        >
        Check all
      </label>
    `;
  }
});

const f = document.createElement("input");
f.addEventListener("change", e => {})
