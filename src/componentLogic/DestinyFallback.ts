import { isComponent } from "./isComponent.js";
import { xml, Ref, Component } from "../mod.js";

export class DestinyFallback extends Component {
  static captureProps = true;
  forwardProps = new Ref();
  
  declare assignedData: {
    readonly prop: Map<"for", Promise<Record<string, typeof Component>>>,
  } & typeof Component.prototype.assignedData;

  constructor () {
    super();
    queueMicrotask(async () => {
      const module = await this.assignedData.prop.get("for")!;
      const component = Object.values(module).shift();
      if (!component || !isComponent(component)) {
        throw new Error(`Invalid component constructor ${String(component)}`);
      }
      this.replaceWith(
        xml`
          <${component}
            destiny:ref=${this.forwardProps}
            destiny:in=${(element: HTMLElement) => element.append(...this.childNodes)}
          />
        `.content,
      );
    });
  }

  template = xml`
    Loading...
  `;
}
