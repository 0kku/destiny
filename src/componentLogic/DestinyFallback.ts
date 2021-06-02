import { isComponent } from "./isComponent.js";
import { xml, Ref, Component } from "../mod.js";
import { getElementData } from "./elementData.js";
import { describeType } from "../utils/describeType.js";

export class DestinyFallback extends Component {
  static captureProps = true;
  forwardProps = new Ref();

  constructor () {
    super();
    queueMicrotask(async () => {
      const module = await getElementData(this)!.prop.get("for");
      if (typeof module !== "object" || !module) {
        throw new TypeError(`Invalid type ${describeType(module)} supplied for prop:for`);
      }
      const component: unknown = Object.values(module).shift();
      if (!isComponent(component)) {
        throw new TypeError(`Invalid component constructor ${describeType(component)} supplied for prop:for`);
      }
      this.replaceWith(
        xml`
          <${component}
            destiny:ref=${this.forwardProps}
            destiny:mount=${(element: HTMLElement) => element.append(...this.childNodes)}
          />
        `.content,
      );
    });
  }

  template = xml`
    Loading...
  `;
}
