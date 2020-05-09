const propToWatcherMap = {
  value: "input",
  checked: "change",
  valueAsDate: "change",
  valueAsNumber: "change",
} as const;

export type watchedAttribute = keyof typeof propToWatcherMap;

/**
 * Figures out if and what event listener needs to be attached to a DOM element based on the name of an attribute.
 * @param attributeName the attribute name to be used for determining the event listener type
 */
export function matchChangeWatcher (
  attributeName: string,
) {
  return propToWatcherMap[attributeName as watchedAttribute] ?? "";
}
