export function resolveSlotPropIndex (
  value: string,
): number {
  return Number(
    /^__internal_(?<index>[0-9]+)_$/u
    .exec(value)
    ?.groups
    ?.index
    ?? "-1"
  );
}
