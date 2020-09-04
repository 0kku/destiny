import { register, xml } from "../mod.js";
import { deferredElements } from "../parsing/deferredElements.js";
import { assignElementData } from "../parsing/hookSlotsUp/hookAttributeSlotsUp/elementData/_assignElementData.js";
import type { Ref, RefPromise } from "./Ref.js";
import type { Renderable } from "../parsing/Renderable";
import type { Slot } from "../parsing/Slot.js";

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
  template: Renderable = xml`<slot />`;
  set destinySlot (
    _: Slot | undefined,
  ) {}

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
        this.template.content,
      );
    });

    // Disabled for now due to lack of vendor support
    // try {
    //   this.attachInternals();
    // } catch (e) {
    //   console.error("Element internals couldn't be attached due to lack of browser support. If you're using Firefox, the feature can be enabled in about:config by toggling the dom.webcomponents.elementInternals.enabled flag on. If you're using something other than Firefox or a Chromium based browser, consider switching to a better browser. Error message: ", e);
    // }
  }

  replaceWith (
    ...nodes: Array<string | Node>
  ): void {
    if (this.destinySlot) {
      this.destinySlot.replaceItem(this, ...nodes);
    } else {
      super.replaceWith(...nodes);
    }
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

  static register (): string {
    return register(
      this as typeof DestinyElement & (new () => DestinyElement),
      false,
    );
  }

  static get tagName (): string {
    return this.register();
  }

  static [Symbol.toPrimitive] (): string {
    return this.tagName;
  }
}
