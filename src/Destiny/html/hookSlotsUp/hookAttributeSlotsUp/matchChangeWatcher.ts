const propToWatcherMap = {
  value: "input",
  checked: "change",
  valueAsDate: "change",
  valueAsNumber: "change",
} as const;

export type watchedAttribute = keyof typeof propToWatcherMap;

export function matchChangeWatcher (
  attributeName: string,
) {
  return propToWatcherMap[attributeName as watchedAttribute] ?? "";
}
