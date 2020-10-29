const propToWatcherMap = {
  value: "input",
  checked: "change",
  valueAsDate: "input",
  valueAsNumber: "input",
} as const;

export type TWatchedAttribute = keyof typeof propToWatcherMap;

/**
 * Figures out if and what event listener needs to be attached to a DOM element based on the name of an attribute.
 * @param attributeName the attribute name to be used for determining the event listener type
 */
export function matchChangeWatcher (
  attributeName: string,
): typeof propToWatcherMap[TWatchedAttribute] | "" {
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  return propToWatcherMap[attributeName as TWatchedAttribute] ?? "";
}
