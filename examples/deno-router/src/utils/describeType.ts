import { safeStringifyObject } from "./safeStringifyObject.ts";

export function describeType (
  input: unknown,
): string {
  if (input === null || input === undefined) {
    return `[${String(input)}]`;
  } else if (typeof input === "object") {
    return safeStringifyObject(input!);
  } else {
    return `[${typeof input} ${String(input)}]`;
  }
}
