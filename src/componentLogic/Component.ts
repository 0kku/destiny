import { xml } from "../parsing/_xml.js";
import { register } from "./register.js";
import { attachCSSProperties } from "../styling/attachCSSProperties.js";
import { deferredElements } from "../parsing/deferredElements.js";
import { supportsAdoptedStyleSheets } from "../styling/supportsAdoptedStyleSheets.js";
import { arrayWrap } from "../utils/arrayWrap.js";
import { getElementData } from "./elementData.js";
import { isReactive } from "../typeChecks/isReactive.js";
import type { Renderable } from "../parsing/Renderable.js";
import type { Slot } from "../parsing/Slot.js";
import type { ReadonlyReactiveValue } from "../reactive/ReactiveValue/_ReadonlyReactiveValue.js";
import type { ReadonlyReactiveArray } from "../reactive/ReactiveArray/_ReadonlyReactiveArray.js";
import type { CSSTemplate } from "../styling/CSSTemplate.js";
import type { TElementData } from "../parsing/hookSlotsUp/hookAttributeSlotsUp/elementData/TElementData.js";

// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
interface ComponentImplementation {
  destinySlot?: Slot,
}

/**
 * A class for creating new custom elements in Destiny UI.
 */
class ComponentImplementation extends HTMLElement {
  static captureProps = false;
  template: (
    | Renderable
    | ReadonlyReactiveValue<any>
    | ReadonlyReactiveArray<any>
  ) = xml`<slot />`;
  static styles: Array<CSSTemplate> | CSSTemplate = [];

  constructor () {
    super();
    if (new.target === ComponentImplementation) {
      throw new TypeError("Can't initialize abstract class.");
    }

    const shadow = this.attachShadow({ mode: "open" });
    // Wait for subclasses to finish initialization:
    queueMicrotask(() => {
      // Upgrade values that have an associated setter but were assigned before the setters existed:
      for (const [key, value] of this.elementData?.prop ?? []) {
        // eslint-disable-next-line @typescript-eslint/ban-types
        let proto = this.constructor.prototype as Function | undefined;
        let descriptor: PropertyDescriptor | undefined;

        while (!descriptor && proto && proto !== HTMLElement) {
          descriptor = Object.getOwnPropertyDescriptor(
            proto,
            key,
          );
          // eslint-disable-next-line @typescript-eslint/ban-types
          proto = Object.getPrototypeOf(proto) as Function;
        }
        if (!descriptor?.set) continue;
        // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
        delete this[key as keyof this];
        this[key as keyof this] = value as this[keyof this];
      }

      shadow.appendChild(
        isReactive(this.template)
        ? xml`${this.template}`.content
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

  override replaceWith (
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

  get elementData (): TElementData | undefined{
    return getElementData(this);
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

// eslint-disable-next-line @typescript-eslint/naming-convention
export type Component<
  // eslint-disable-next-line @typescript-eslint/ban-types
  TProperties extends Record<string, unknown> = {}
> = (
  & ComponentImplementation
  & TProperties
);

type TComponentConstructor = (
  // eslint-disable-next-line @typescript-eslint/ban-types
  & (new <TProperties extends Record<string, unknown> = {}> () => Component<TProperties>)
  & typeof ComponentImplementation
);

// eslint-disable-next-line @typescript-eslint/naming-convention
export const Component = ComponentImplementation as TComponentConstructor;
