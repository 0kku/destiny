import { ReactivePrimitive } from "../../../mod.ts";
import { matchChangeWatcher } from "./matchChangeWatcher.ts";
import { ReadonlyReactivePrimitive } from "../../../reactive/ReactivePrimitive.ts";
import type { TWatchedAttribute } from "./matchChangeWatcher.ts";

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
    value.bind(whatToDo, {dependents: [element]});
  } else if (value instanceof ReadonlyReactivePrimitive) {
    value.bind(whatToDo, {dependents: [element]});
  } else {
    whatToDo(value);
  }
}
