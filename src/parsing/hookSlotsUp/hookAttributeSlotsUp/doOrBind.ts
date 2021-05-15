import { ReactivePrimitive } from "../../../mod.js";
import { matchChangeWatcher } from "./matchChangeWatcher.js";
import type { TWatchedAttribute } from "./matchChangeWatcher.js";
import { ReadonlyReactivePrimitive } from "/dist/reactive/ReactivePrimitive.js";

export function doOrBind (
  element: HTMLElement,
  key: string,
  value: unknown,
  whatToDo: (value: unknown) => void,
): void {
  if (value instanceof ReactivePrimitive) {
    const changeWatcher = matchChangeWatcher(key);
    if (changeWatcher) {
      element.addEventListener(changeWatcher, e => {
        // Sets the value whilst excluding itself of callbacks to call after the change
        value.set(
          (e.currentTarget as HTMLInputElement | null)
          ?.[key as TWatchedAttribute],
          { noUpdate: [whatToDo] },
        );
      });
    }
    value.bind(whatToDo);
  } else if (value instanceof ReadonlyReactivePrimitive) {
    value.bind(whatToDo);
  } else {
    whatToDo(value);
  }
}
