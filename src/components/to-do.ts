import { DestinyElement, html, reactive } from "../Destiny/_Destiny.js";

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
      title: "Show this off to Mike",
      done: false,
      editing: false,
    },
  ]);

  render () {
    return html`
      <style>
        label {
          display: inline-block;
          width: 200px;
        }

        [type=text] {
          box-sizing: border-box;
          width: 200px;
        }
        label [type=text] {
          width: 175px;
        }
      </style>
      <ul>
        ${this.#items.map((item, i) => html`
          <li>
            <label>
              <input
                type=checkbox
                @checked=${item.done}
              >
              ${item.editing.pipe(editing => editing.value
                ? html`<input type=text value=${item.title}>`
                : html`
                  <span
                    style=${item.done.pipe(
                      v => v.value && "text-decoration: line-through",
                    )}
                  >
                    ${item.title}
                  </span>
                `
              )}
            </label>
            ${item.editing.pipe(editing => editing.value
              ? html`
                <input
                  type=button
                  value=💾
                  title=Save
                  @onclick=${() => item.editing.value = false}
                >`
              : html`
                <input
                  type=button
                  value=📝
                  title=Edit
                  @onclick=${() => item.editing.value = true}
                >`
            )}
            <input
              type=button
              value=🚮
              title=Delete
              @onclick=${() => this.#items.splice(i.value, 1)}
            >
          </li>
        `)}
        <li>
          <form
            @onsubmit=${(e: Event) => {
              e.preventDefault();
              this.#items.push({
                title: this.#newValue.value,
                done: false,
                editing: false,
              });
              this.#newValue.value = "";
            }}
          >
            <input type=text @value=${this.#newValue} required>
            <input type=submit value=➕>
          </form>
        </li>
      </ul>
      <label>
        <input
          type=checkbox
          class=check-all
          @checked=${this.#items.every(item => item.done.value)}
          @indeterminate=${this.#items.exclusiveSome(item => item.done.value)}
          @onchange=${(e: InputEvent) => {
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
