import { ReactiveArray, ReactivePrimitive, reactiveObject } from "../_Destiny.js";
import { isObject } from "../typeChecks/isObject.js";
import { IReactiveValueType } from "./types/IReactiveRecursive.js";
import { IReactive } from "./types/IReactive.js";
import { isSpecialCaseObject } from "./specialCaseObjects.js";
import { isReactive } from "../typeChecks/isReactive.js";

function reactive<T extends Promise<any>> (
  initialValue: T,
  options: {
    fallback: T,
    parent?: IReactive<any>,
  },
): ReactivePrimitive<T extends Promise<infer V> ? V : never>;
function reactive<T> (
  initialValue: T,
  options?: {
    parent?: IReactive<any>,
  },
): IReactiveValueType<T>;
function reactive<T> (
  initialValue: T,
  options: {
    fallback?: T,
    parent?: IReactive<any>,
  } = {},
) {
  if (isReactive(initialValue)) {
    console.log(initialValue, "was already reactive");
    return initialValue;
  } else if (initialValue instanceof Array) {
    const newArr = new ReactiveArray(...initialValue);
    newArr.bind(() => options?.parent?.update());
    // console.log(initialValue, "was an Array, and became", newArr);
    return newArr;
  } else if (initialValue instanceof Promise) {
    const ref = new ReactivePrimitive(options?.fallback);
    ref.bind(() => options?.parent?.update())
    initialValue.then(value => ref.value = value);
    // console.log(initialValue, "was a Promise, and became", ref);
    return ref;
  } else if (isSpecialCaseObject(initialValue)) {
    const ref = new ReactivePrimitive(initialValue);
    options.parent && ref.bind(() => options?.parent?.update());
    // console.log(initialValue, "was an Object, and became", ref);
    return ref;
  } else if (isObject(initialValue)) {
    const ref = reactiveObject(initialValue, options?.parent);
    // console.log(initialValue, "was an Object, and became", ref);
    return ref;
  } else {
    const ref = new ReactivePrimitive(initialValue);
    ref.bind(() => options?.parent?.update());
    // console.log(initialValue, "was a primitive, and became", ref);
    return ref;
  }
}

export {reactive};
