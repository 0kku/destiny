import { WeakMultiRef } from "../utils/WeakMultiRef.js";

export let currentSideEffect: VoidFunction | undefined;

const hold = new WeakMap<object, VoidFunction>();

type TSideEffectOptions = {
  dependents?: ReadonlyArray<object>,
};

/**
 * Runs the given callback once immediately and again whenever any of the reactive values used in the callback are updated.
 * 
 * @param callback The function that should be run whenever values change
 */
export function sideEffect (
  callback: (() => void),
  options: TSideEffectOptions = {},
): void {
  function fn () {
    currentSideEffect = fn;
    callback();
    currentSideEffect = undefined;
  }
  fn();

  if (options.dependents?.length) {
    hold.set(new WeakMultiRef([...options.dependents]), fn);
  } else if (options.dependents?.length !== 0) {
    hold.set(globalThis, fn);
  }
}
