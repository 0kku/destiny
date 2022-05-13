export function resolveSlotPropIndex(
  value: string,
): number {
  return (
    value.startsWith("__internal_") ? Number(value.slice(11, -1)) : -1
  );
}
