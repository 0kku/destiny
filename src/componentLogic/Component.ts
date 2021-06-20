import { register, xml, attachCSSProperties, html } from "../mod.js";
import { deferredElements } from "../parsing/deferredElements.js";
import { assignElementData } from "../parsing/hookSlotsUp/hookAttributeSlotsUp/elementData/_assignElementData.js";
import { supportsAdoptedStyleSheets } from "../styling/supportsAdoptedStyleSheets.js";
import { arrayWrap } from "../utils/arrayWrap.js";
import { getElementData } from "./elementData.js";
import { isReactive } from "../typeChecks/isReactive.js";
import type { Ref, RefPromise } from "./Ref.js";
import type { Renderable } from "../parsing/Renderable.js";
import type { Slot } from "../parsing/Slot.js";
import type { ReadonlyReactiveValue } from "../reactive/ReactiveValue.js";
import type { ReadonlyReactiveArray } from "../reactive/ReactiveArray/_ReactiveArray.js";
import type { CSSTemplate } from "../styling/CSSTemplate.js";

// @ts-ignore I don't know how to describe this type correctly
// eslint-disable-next-line
export interface Component<TProperties extends Record<string, unknown> = {}> extends TProperties {
  destinySlot?: Slot,
}

/**
 * A class for creating new custom elements in Destiny UI.
 */
export class Component extends HTMLElement {
  static captureProps = false;
  forwardProps?: Ref<HTMLElement> | RefPromise<HTMLElement>;
  template: (
    | Renderable
    | ReadonlyReactiveValue<any>
    | ReadonlyReactiveArray<any>
  ) = xml`<slot />`;
  static styles: Array<CSSTemplate> | CSSTemplate = [];

  constructor () {
    super();
    if (new.target === Component) {
      throw new TypeError("Can't initialize abstract class.");
    }
    const shadow = this.attachShadow({ mode: "open" });
    queueMicrotask(() => {
      if (this.forwardProps) {
        this.forwardProps.then(element => {
          assignElementData(
            element,
            getElementData(this)!,
          );
        });
      }

      shadow.appendChild(
        isReactive(this.template)
        ? html`${this.template}`.content
        : this.template.content,
      );

      if (supportsAdoptedStyleSheets) {
        shadow.adoptedStyleSheets = arrayWrap(new.target.styles).map(v => v.styleSheet);
      } else {
        shadow.append(...arrayWrap(new.target.styles).map(v => v.styleElement));
      }
    });

    // Disabled for now due to lack of vendor support
    // try {
    //   this.attachInternals();
    // } catch (e) {
    //   console.error("Element internals couldn't be attached due to lack of browser support. If you're using Firefox, the feature can be enabled in about:config by toggling the dom.webcomponents.elementInternals.enabled flag on. If you're using something other than Firefox or a Chromium based browser, consider switching to a better browser. Error message: ", e);
    // }
  }

  /**
   * Synchonizes a CSS property of this element to a `ReactiveValue`.
   * 
   * @param property  CSS property to be synchronized
   * @param source    A ReactiveValue whose value is to be used for the CSS Property
   */
  attachCSSProperties (
    styles: {
      [Key: string]: ReadonlyReactiveValue<string>,
    },
  ): void {
    attachCSSProperties(this, styles);
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

  unmount (
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
      this as typeof Component & (new () => Component),
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
