import { ReadonlyReactiveArray } from "./_ReadonlyReactiveArray.js";
import type { TUnwrapReactiveArray } from "./TUnwrapReactiveArray.js";

type TUnwrapArray<Input> = (
  Input extends ReadonlyArray<infer V>
  ? V
  : never
);

export const flatten = <
  Input extends ReadonlyArray<unknown>,
>(
  input: Input,
): Array<TUnwrapReactiveArray<TUnwrapArray<Input>>> => {
  return input.reduce((acc: Array<TUnwrapReactiveArray<TUnwrapArray<Input>>>, v) => {
    v instanceof ReadonlyReactiveArray
    ? acc.push(...v.value as Array<TUnwrapReactiveArray<TUnwrapArray<Input>>>)
    : acc.push(v as TUnwrapReactiveArray<TUnwrapArray<Input>>);
    return acc;
  }, []);
};
