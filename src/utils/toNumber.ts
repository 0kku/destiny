/**
 * Makes an attempt to convert any value to a `number`. Returns `NaN` if conversion fails.
 * @param value Value to be converted to a number
 */
export function toNumber(
  value: unknown,
): number {
  try {
    return Number(value);
  } catch { // Number(Symbol()) throws, but we just want to know if it can be converted to a number
    return NaN;
  }
}
