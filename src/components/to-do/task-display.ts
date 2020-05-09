import { DestinyElement, html } from "../../Destiny/_Destiny.js";
import { IReactiveObject } from "../../Destiny/reactive/types/IReactiveObject.js";

customElements.define("task-display", class extends DestinyElement {
  set item (
    _: IReactiveObject<{
        title: string;
        done: boolean;
        editing: boolean;
    }>,
  ) {}
  set removeItem (
    _: () => void,
  ) {}

  render () {
    return html`
      <label>
        <input
          type=checkbox
          prop:checked=${this.item.done}
        >
        <span
          class=task-name
          style=${this.item.done.pipe(
            v => v.value && "text-decoration: line-through",
          )}
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
      <input
        type=button
        value=🚮
        title=Delete
        on:click=${this.removeItem}
      >
    `;
  }
});
