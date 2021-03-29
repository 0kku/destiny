import { Component, xml } from "/dist/mod.js";
import type { TReactiveObject } from "/dist/mod.js";

export class TaskItem extends Component<{
  item: TReactiveObject<{
    title: string,
    done: boolean,
    editing: boolean,
  }>,
  removeItem: () => void,
}> {
  constructor () {
    super();
    this.setAttribute("role", "listitem");
  }

  template = xml/*html*/`
    <style>
      :host {
        padding-bottom: var(--xs);
        line-height: var(--l);
      }

      form {
        height: 100%;
        font-size: var(--m);
      }

      input:not([type=checkbox]) {
        vertical-align: top;
        box-sizing: border-box;
        width: var(--xl);
        height: var(--l);
        background: var(--element-color);
        outline: none;
        border-radius: var(--border-radius);
        box-shadow: 0 1px 1px rgba(0,0,0,.4);
        border: 1px solid transparent;
        transition: all .1s;
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
        color: white;
        text-shadow: 1px 1px 1px rgba(0,0,0,.7);
        padding: 0 var(--s);
        width: 200px;
        height: var(--l);
        background: var(--element-color);
        border: none;
        outline: none;
        border-radius: var(--border-radius);
      }

      .task-name {
        display: inline-block;
        box-sizing: border-box;
        width: 175px;
      }

      [type=text] {
        box-sizing: border-box;
        width: 200px;
      }

      input:not([type=text]), label {
        cursor: pointer;
      }
    </style>
    <form
      class="edit-task"
      on:submit="${(e: Event) => {
        e.preventDefault();
        this.item.editing.value = false;
      }}"
    >
      ${this.item.editing.pipe(editing => !editing
        ? xml`
          <label>
            <input
              type="checkbox"
              prop:checked="${this.item.done}"
            />
            <span
              class="task-name"
              style="${this.item.done.truthy("text-decoration: line-through")}"
            >
              ${this.item.title}
            </span>
          </label>
          <input
            type="button"
            value="📝"
            title="Edit"
            on:click="${() => this.item.editing.value = true}"
          />
        ` : xml`
          <input
            type="text"
            value="${this.item.title}"
            required=""
            destiny:in="${(e: HTMLInputElement) => e.focus()}"
          />
          <input
            type="submit"
            value="💾"
            title="Save"
          />
        `
      )}
      <input
        type="button"
        value="🚮"
        title="Delete"
        on:click="${this.removeItem}"
      />
    </form>
  `;
}
