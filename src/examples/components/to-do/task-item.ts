import { DestinyElement, html, component } from "../../../mod.js";
import { TReactiveObject } from "../../../reactive/types/IReactiveObject.js";

component(class TaskItem extends DestinyElement {
  set item (
    _: TReactiveObject<{
        title: string,
        done: boolean,
        editing: boolean,
    }>,
  ) {}
  set removeItem (
    _: () => void,
  ) {}

  render () {
    return html`
      <style>
        li {
          height: 100%;
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
      <li>
        <form
          class=edit-task
          on:submit=${(e: Event) => {
            e.preventDefault();
            this.item.editing.value = false;
          }}
        >
          ${this.item.editing.pipe(editing => !editing
            ? html`
              <label>
                <input
                  type=checkbox
                  prop:checked=${this.item.done}
                >
                <span
                  class=task-name
                  style=${this.item.done.truthy("text-decoration: line-through")}
                >
                  ${this.item.title}
                </span>
              </label>
              <input
                type=button
                value=📝
                title=Edit
                on:click=${() => this.item.editing.value = true}
              >
            ` : html`
              <input
                type=text
                value=${this.item.title}
                required
                destiny:in=${(e: HTMLInputElement) => e.focus()}
              >
              <input
                type=submit
                value=💾
                title=Save
              >
            `
          )}
          <input
            type=button
            value=🚮
            title=Delete
            on:click=${this.removeItem}
          >
        </form>
      </li>
    `;
  }
});
