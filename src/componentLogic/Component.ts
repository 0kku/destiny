import { xml } from "../parsing/_xml.ts";
import { register } from "./register.ts";
import { attachCSSProperties } from "../styling/attachCSSProperties.ts";
import { deferredElements } from "../parsing/deferredElements.ts";
import { assignElementData } from "../parsing/hookSlotsUp/hookAttributeSlotsUp/elementData/_assignElementData.ts";
import { supportsAdoptedStyleSheets } from "../styling/supportsAdoptedStyleSheets.ts";
import { arrayWrap } from "../utils/arrayWrap.ts";
import { getElementData } from "./elementData.ts";
import { isReactive } from "../typeChecks/isReactive.ts";
import { elementData } from "./elementData.ts";
import type { Ref, RefPromise } from "./Ref.ts";
import type { Renderable } from "../parsing/Renderable.ts";
import type { Slot } from "../parsing/Slot.ts";
import type { ReadonlyReactiveValue } from "../reactive/ReactiveValue/_ReadonlyReactiveValue.ts";
import type { ReadonlyReactiveArray } from "../reactive/ReactiveArray/_ReadonlyReactiveArray.ts";
import type { CSSTemplate } from "../styling/CSSTemplate.ts";

interface ComponentImplementation {
  destinySlot?: Slot,
}

/**
 * A class for creating new custom elements in Destiny UI.
 */
class ComponentImplementation extends HTMLElement {
  static captureProps = false;
  forwardProps?: Ref<HTMLElement> | RefPromise<HTMLElement>;
  // TODO(@ebebbington): Why is `template` typed like this? Isn't it only ever assigned `xml`...`` eg `TemplateResult`? 
  template: (
    | Renderable
    // deno-lint-ignore no-explicit-any
    | ReadonlyReactiveValue<any>
    // deno-lint-ignore no-explicit-any
    | ReadonlyReactiveArray<any>
  ) = xml`<slot />`;
  static styles: Array<CSSTemplate> | CSSTemplate = [];

  constructor () {
    super();
    if (new.target === ComponentImplementation) {
      throw new TypeError("Can't initialize abstract class.");
    }

    const data = getElementData(this);
    if (data && this.forwardProps) {
      this.forwardProps.then(element => {
        elementData.set(element, data);
        assignElementData(
          element,
          data,
        );
      });
    }

    const shadow = this.attachShadow({ mode: "open" });
    queueMicrotask(() => {
      // Upgrade values that have an associated setter but were assigned before the setters existed:
      if (data) {
        for (const [key, value] of data.prop) {
          let proto = this.constructor.prototype;
          let descriptor: PropertyDescriptor | undefined;

          while (!descriptor && proto && proto !== HTMLElement) {
            descriptor = Object.getOwnPropertyDescriptor(
              proto,
              key,
            );
            proto = Object.getPrototypeOf(proto);
          }
          if (!descriptor?.set) continue;
          delete this[key as keyof this];
          this[key as keyof this] = value as this[keyof this];
        }
      }

      shadow.appendChild(
        isReactive(this.template)
        ? xml`${this.template}`.content
        : this.template.content,
      );

      if (supportsAdoptedStyleSheets) {
        // @ts-ignore This does exist, but lib doesn't contain the declaration yet. We also used `destiny/src/globalThis.d.ts` to provide the typings when using Node, but there doesn't seem to be a way to include this in the `emit`
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

export type Component<
  TProperties extends Record<string, unknown> = Record<string, unknown>
> = (
  & ComponentImplementation
  & TProperties
);

type TComponentConstructor = (
  // deno-lint-ignore ban-types
  & (new <TProperties extends Record<string, unknown> = {}> () => Component<TProperties>)
  & typeof ComponentImplementation
);

export const Component = ComponentImplementation as TComponentConstructor;
