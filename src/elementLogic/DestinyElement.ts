import { deferredElements } from "../parsing/deferredElements.js";
import type { Renderable } from "../parsing/Renderable";
import { xml } from "../mod.js";
import { Ref, RefPromise } from "./Ref.js";
import { assignElementData } from "../parsing/hookSlotsUp/hookAttributeSlotsUp/elementData/_assignElementData.js";
// import { attributeNamespaces } from "../parsing/hookSlotsUp/hookAttributeSlotsUp/attributeNamespaces/_attributeNamespaces.js";

// export const forwardedElements = new Map<HTMLElement, Ref<HTMLElement> | RefPromise<any>>();

/**
 * A class for creating new custom elements in Destiny UI.
 */
export abstract class DestinyElement extends HTMLElement {
  static captureProps = false;
  forwardProps?: Ref<HTMLElement> | RefPromise<HTMLElement>;
  assignedData = {
    prop: new Map<string, unknown>(),
    on: new Map<string, unknown>(),
    call: new Map<string, unknown>(),
    destiny: new Map<string, unknown>(),
    attribute: new Map<string, unknown>(),
  } as const;

  constructor () {
    super();
    if (new.target === DestinyElement) {
      throw new TypeError("Can't initialize abstract class.");
    }
    const shadow = this.attachShadow({ mode: "open" });
    queueMicrotask(() => {
      if (this.forwardProps) {
        this.forwardProps.then(element => {
          assignElementData(element, this.assignedData);
        });
      }
      shadow.appendChild(
        this.render().content,
      );
    });

    // Disabled for now due to lack of vendor support
    // try {
    //   this.attachInternals();
    // } catch (e) {
    //   console.error("Element internals couldn't be attached due to lack of browser support. If you're using Firefox, the feature can be enabled in about:config by toggling the dom.webcomponents.elementInternals.enabled flag on. If you're using something other than Firefox or a Chromium based browser, consider switching to a better browser. Error message: ", e);
    // }
  }

  out (
    callback: (element: HTMLElement) => Promise<void> | void,
  ): this {
    deferredElements.set(
      this,
      callback,
    );

    return this;
  }

  render (): Renderable {
    return xml`<slot />`;
  }
}
