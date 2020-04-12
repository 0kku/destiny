export function toNumber (
  value: unknown,
): number {
  try {
    return Number(value);
  } catch { // Number(Symbol()) throws
    return NaN;
  }
}
