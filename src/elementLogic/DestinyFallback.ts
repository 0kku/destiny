import { isDestinyElement } from "./isDestinyElement.js";
import { xml, Ref, DestinyElement } from "../mod.js";

export class DestinyFallback extends DestinyElement {
  static captureProps = true;
  forwardProps = new Ref();
  
  declare assignedData: {
    readonly prop: Map<"for", Promise<Record<string, typeof DestinyElement>>>,
  } & typeof DestinyElement.prototype.assignedData;

  constructor () {
    super();
    queueMicrotask(async () => {
      const module = await this.assignedData.prop.get("for")!;
      const component = Object.values(module).shift();
      if (!component || !isDestinyElement(component)) {
        throw new Error(`Invalid component constructor ${String(component)}`);
      }
      this.replaceWith(
        xml`
          <${component}
            destiny:ref="${this.forwardProps}"
            call:append="${[...this.childNodes]}"
          />
        `.content,
      );
    });
  }

  template = xml`
    Loading...
  `;
}
