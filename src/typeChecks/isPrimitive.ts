import { primitive } from "../reactive/types/primitive";

/**
 * Checks if a given value is one of the seven primitive types in JavaScript.
 * @param input The value to be checked
 */
export function isPrimitive (
  input: unknown,
): input is primitive {
  return [
    "string",
    "number",
    "bigint",
    "boolean",
    "symbol",
    "undefined",
  ].includes(typeof input) || input === null;
}