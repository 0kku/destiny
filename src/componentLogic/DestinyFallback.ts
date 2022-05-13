import { Component } from "./Component.ts";
import { xml } from "../parsing/_xml.ts";
import { getElementData } from "./elementData.ts";
import { describeType } from "../utils/describeType.ts";
import { ReactiveValue } from "../reactive/ReactiveValue/_ReactiveValue.ts";
import { isRenderable } from "../typeChecks/isRenderable.ts";
import { componentOrComponentModule } from "./componentOrComponentModule.ts";
import type { Renderable } from "../parsing/Renderable.ts";

export class DestinyFallback extends Component {
  static override captureProps = true;

  #view = new ReactiveValue<Renderable>(xml``);

  constructor() {
    super();
    queueMicrotask(async () => {
      const data = getElementData(this)!;
      const props = data.prop;
      const fallback = props.get("fallback");
      if (fallback) {
        if (!isRenderable(fallback)) {
          throw new TypeError(
            `Incorect type ${
              describeType(fallback)
            } for prop:fallback: Renderable expected`,
          );
        }
        this.#view.value = fallback;
      }
      try {
        const module = await props.get("for");
        const component = componentOrComponentModule(module);

        this.#view.value = xml`
          <${component}
            destiny:mount=${(element: HTMLElement) =>
          element.append(...this.childNodes)}
            destiny:data=${data}
          />
        `;
      } catch (error) {
        const exceptionHandler = props.get("catch");
        if (exceptionHandler) {
          if (typeof exceptionHandler !== "function") {
            throw new TypeError(
              `Uncallable type ${
                describeType(exceptionHandler)
              } provided for prop:error as the exception handler. Expected type is (error: Error) => Renderable.`,
            );
          }
          const template: unknown = exceptionHandler(error);
          if (!isRenderable(template)) {
            throw new TypeError(
              `Exception handler for prop:error retrned ${
                describeType(template)
              }, but Renderable was expected.`,
            );
          }
          this.#view.value = template;
        } else {
          throw error;
        }
      }
    });
  }

  override template = this.#view;
}
