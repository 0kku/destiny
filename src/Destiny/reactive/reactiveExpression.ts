import { ReactivePrimitive, ReactiveArray } from "../_Destiny.js";
import { isReactive } from "../typeChecks/isReactive.js";

const cache: WeakMap<TemplateStringsArray, Function> = new WeakMap;

/**
 * ! **This method is experimental and might be removed in the future due to lack of possibility of type checking.**
 * 
 * This is a shorthand for `ReactivePrimitive.from()`. It takes a template, with slotted-in reactive items or other data types. The output will be updated whenever any of the input reactive items change.
 * 
 * **Note: the expression is not akin to arrow functions. It does _not_ have access to outside variables, so those need to be slotted in also.**
 * 
 * Example usage:
 * ```js
 * const a = reactive(2);
 * const b = reactive(5);
 * const c = expression`${a} + ${b}`;
 * console.log(c.value); // 6
 * a *= -3;
 * console.log(c.value); // -1
 * ```
 * _Note that `c` in this example is of type `Readonly<ReactivePrimitive<unknown>>`. I'm afraid it's impossible to infer the type correctly._
 */
export function expression (
  templ: TemplateStringsArray,
  ...args: unknown[]
): Readonly<ReactivePrimitive<unknown>> {
  
  let fn = cache.get(templ);
  if (!fn) {
    cache.set(
      templ,
      fn = generateFn(templ, args),
    );
  }

  return ReactivePrimitive.from(
    () => fn!(args),
    ...args.filter(arg => isReactive(arg)) as Array<ReactivePrimitive<unknown> | ReactiveArray<unknown>>
  )
}

function generateFn (
  templ: TemplateStringsArray,
  args: unknown[]
) {
  const functionBody = templ.reduce(
    (acc, v, i) => `${acc}args[${i-1}]${isReactive(args[i-1]) ? ".value" : ""}${v}`,
  );
  return new Function(
    "args",
    `return (${functionBody})`,
  );
}
