type TSlotPositions = Array<{
  groups: {
    start?: string,
    index: string,
    after?: string,
  },
}>;

export function resolveSlotPositions (
  value: string,
): TSlotPositions {
  return [...value.matchAll(
    /(?<start>^.+?)?__internal_(?<index>[0-9]+)_(?<after>.+?(?=__internal_(?:[0-9]+)_|$))?/gu,
  )] as unknown as TSlotPositions;
}
