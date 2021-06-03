import type { TPrimitive } from "../reactive/types/IPrimitive.ts";

/**
 * Checks if a given value is one of the seven primitive types in JavaScript.
 * @param input The value to be checked
 */
export function isPrimitive (
  input: unknown,
): input is TPrimitive {
  return ![
    "object",
    "function",
  ].includes(typeof input) || input === null;
}
