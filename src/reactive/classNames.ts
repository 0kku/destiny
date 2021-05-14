import { computed } from "./computed.js";
import { ReadonlyReactivePrimitive } from "./ReactivePrimitive.js";

export function classNames (
  input: Record<string, boolean | ReadonlyReactivePrimitive<boolean>>,
): ReadonlyReactivePrimitive<string> {
  return computed(() =>
    Object
    .entries(input)
    .filter(([, value]) => 
      value instanceof ReadonlyReactivePrimitive
      ? value.value
      : value
    )
    .map(([key]) => key)
    .join(" "),
  );
}
