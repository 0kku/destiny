import { isComponent } from "./isComponent.js";
import { xml, Ref, Component } from "../mod.js";
import { getElementData } from "./elementData.js";
import { describeType } from "../utils/describeType.js";
import { ReactiveValue } from "../reactive/ReactiveValue.js";
import { TemplateResult } from "../parsing/TemplateResult.js";

export class DestinyFallback extends Component {
  static captureProps = true;
  forwardProps = new Ref();

  #view = new ReactiveValue(xml``);

  constructor () {
    super();
    queueMicrotask(async () => {
      const props = getElementData(this)!.prop;
      const fallback = props.get("fallback");
      if (fallback) {
        if (!(fallback instanceof TemplateResult)) {
          throw new TypeError(`Incorect type ${describeType(fallback)} for prop:fallback: TemplateResult expected`);
        }
        this.#view.value = fallback;
      }
      const module = await props.get("for");
      if (typeof module !== "object" || !module) {
        throw new TypeError(`Invalid type ${describeType(module)} supplied for prop:for`);
      }
      const component: unknown = Object.values(module).shift();
      if (!isComponent(component)) {
        throw new TypeError(`Invalid component constructor ${describeType(component)} supplied for prop:for`);
      }
      this.#view.value = xml`
        <${component}
          destiny:ref=${this.forwardProps}
          destiny:mount=${(element: HTMLElement) => element.append(...this.childNodes)}
        />
      `;
    });
  }

  template = this.#view;
}
