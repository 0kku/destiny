import { ReactivePrimitive, ReactiveArray } from "../mod.js";
import { isReactive } from "../typeChecks/isReactive.js";

type TExpressionBody<T = unknown> = (args: Array<unknown>) => T;
const cache: WeakMap<TemplateStringsArray, TExpressionBody> = new WeakMap;

/**
 * ! **This method is experimental and might be removed in the future due to lack of possibility of type checking.**
 * 
 * This is a shorthand for `ReactivePrimitive.from()`. It takes a template, with slotted-in reactive items or other data types. The output will be updated whenever any of the input reactive items change.
 * 
 * **Note: the expression is not akin to arrow functions. It does _not_ have access to outside variables, so those need to be slotted in also.**
 * 
 * Example usage:
 * ```ts
 * const a = reactive(2);
 * const b = reactive(5);
 * const c = expression`${a} + ${b}`;
 * console.log(c.value); // 6
 * a *= -3;
 * console.log(c.value); // -1
 * ```
 * _Note that `c` in this example is of type `Readonly<ReactivePrimitive<unknown>>`. I'm afraid it's impossible to infer the type correctly._
 * 
 * However, you can set the type explicitly:
 * ```ts
 * const c = expression<number>`${a} + ${b}`;
 * ```
 * Here, the type of `c` is `Readonly<ReactivePrimitive<number>>`. There's still no type checking inside the expression and it won't check if that's the type it _actually_ returns, though.
 */
export function expression<T = unknown> (
  templ: TemplateStringsArray,
  ...args: Array<unknown>
): Readonly<ReactivePrimitive<T>> {
  const fn = cache.get(templ) as TExpressionBody<T> | undefined ?? (() => {
    const fn = generateFn<T>(templ, args);
    cache.set(templ, fn);
    return fn;
  })();

  return ReactivePrimitive.from(
    () => fn(args),
    ...args.filter(
      arg => isReactive(arg),
    ) as Array<ReactivePrimitive<unknown> | ReactiveArray<unknown>>,
  );
}

/** Generates a function from a tempalte string to be used as a callback for `ReactivePrimitive.from()`. */
function generateFn<T = unknown> (
  templ: TemplateStringsArray,
  args: Array<unknown>,
): TExpressionBody<T> {
  const functionBody = templ.reduce(
    (acc, v, i) => (
      `${acc}args[${i-1}]${isReactive(args[i-1]) ? ".value" : ""}${v}`
    ),
  );

  // eslint-disable-next-line @typescript-eslint/no-implied-eval
  return new Function(
    "args",
    `return (${functionBody})`,
  ) as TExpressionBody<T>;
}
