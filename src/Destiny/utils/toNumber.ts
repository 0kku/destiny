export function toNumber (
  value: unknown,
): number {
  try {
    return Number(value);
  } catch { // Number(Symbol()) throws, but we just want to know if it can be converted to a number
    return NaN;
  }
}
