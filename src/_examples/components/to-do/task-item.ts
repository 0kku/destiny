import { Component, css, html } from "../../../mod.ts";
import type { TReactiveValueType } from "../../../mod.ts";

import { inputStyles } from "../inputStyles.ts";

export default class TaskItem extends Component<{
  item: TReactiveValueType<{
    title: string;
    done: boolean;
    editing: boolean;
  }>;
  removeItem: () => void;
}> {
  constructor() {
    super();
    this.setAttribute("role", "listitem");
  }

  static override styles = [
    inputStyles,
    css`
      :host {
        padding-bottom: var(--xs);
        line-height: var(--l);
      }

      label {
        display: inline-flex;
        align-items: center;
        justify-content: space-between;
      }

      form {
        height: 100%;
        font-size: var(--m);
      }

      .task-checkbox {
        width: 25px;
      }

      .task-name {
        display: inline-block;
        box-sizing: border-box;
        width: 175px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
    `,
  ];

  override template = html`
    <form
      class="edit-task"
      on:submit=${(e: Event) => {
    e.preventDefault();
    this.item.editing.value = false;
  }}
    >
      ${
    this.item.editing.pipe((editing) =>
      !editing
        ? html`
          <label>
            <span class="task-checkbox">
              <input
                type="checkbox"
                prop:checked=${this.item.done}
              />
            </span>
            <span
              class="task-name"
              style=${this.item.done.truthy("text-decoration: line-through")}
            >
              ${this.item.title}
            </span>
          </label>
          <input
            type="button"
            value="📝"
            title="Edit"
            on:click=${() => this.item.editing.value = true}
          />
        `
        : html`
          <input
            type="text"
            prop:value=${this.item.title}
            required=""
            destiny:mount=${(e: HTMLInputElement) => e.focus()}
          />
          <input
            type="submit"
            value="💾"
            title="Save"
          />
        `
    )
  }
      <input
        type="button"
        value="🚮"
        title="Delete"
        on:click=${this.removeItem}
      />
    </form>
  `;
}
