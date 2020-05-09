import { DestinyElement, html } from "../../Destiny/_Destiny.js";
import { IReactiveObject } from "../../Destiny/reactive/types/IReactiveObject.js";
import "./task-display.js";
import "./task-editing.js";

customElements.define("task-item", class extends DestinyElement {
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
      <style>
        li {
          height: 24px;
          overflow: hidden;
        }
      </style>
      <li
        destiny:in=${(element: HTMLLIElement) => 
          element.animate(
            [
              {height: "0px"},
              {height: "24px"},
            ],
            {duration: 300, easing: "ease"},
          ).play()
        }
        destiny:out=${async (element: HTMLLIElement) => {
          const animation = element.animate(
            [
              {height: "24px"},
              {height: "0px"},
            ],
            {duration: 300, easing: "ease", fill: "forwards"},
          );
          animation.play();
          await animation.finished;
        }}
      >
        ${this.item.editing.pipe(editing => editing.value
          ? html`
            <task-editing
              prop:item=${this.item}
              prop:remove-item=${this.removeItem}
            ></task-editing>
          `
          : html`
            <task-display
              prop:item=${this.item}
              prop:remove-item=${this.removeItem}
            ></task-display>
          `
        )}
      </li>
    `;
  }
});
