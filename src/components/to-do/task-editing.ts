import { DestinyElement, html } from "../../Destiny/_Destiny.js";
import { IReactiveObject } from "../../Destiny/reactive/types/IReactiveObject.js";

customElements.define("task-editing", class extends DestinyElement {
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
      <input
        type=checkbox
        prop:checked=${this.item.done}
      >
      <form
        class=edit-task
        on:submit=${(e: Event) => {
          e.preventDefault();
          this.item.editing.value = false;
        }}
      >
        <input type=text value=${this.item.title}>
        <input
          type=submit
          value=💾
          title=Save
        >
      </form>
      <input
        type=button
        value=🚮
        title=Delete
        on:click=${this.removeItem}
      >
    `;
  }
});
