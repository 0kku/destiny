let counter = 0;
/**
 * Generates an unique ID string.
 */
export function id (): string {
  return Date.now().toString(36) + (counter++).toString(36);
}
