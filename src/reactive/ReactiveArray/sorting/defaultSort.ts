const collator = new Intl.Collator();

export function defaultSort <T> (
  a: T,
  b: T,
): number {
  if (typeof a === "number" && typeof b === "number")  {
    return a - b;
  } else if (typeof a === "string" && typeof b === "string") {
    return collator.compare(a, b);
  } else {
    throw new TypeError("Cannot compare values that are not both strings or both numbers");
  }
}
