import { primitive } from "../reactive/types/primitive";

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