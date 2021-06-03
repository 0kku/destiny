import { computed } from "./computed.ts";
import { ReadonlyReactivePrimitive } from "./ReactivePrimitive.ts";

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
