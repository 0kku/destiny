export function safeStringifyObject (
  // eslint-disable-next-line @typescript-eslint/ban-types
  input: object,
): string {
  try {
    const string = String(input);
    if (string.startsWith("[")) {
      return string;
    } else {
      return `[object ${input.constructor.name} (${string})]`;
    }
  } catch {
    return "[unstringifiable object]";
  }
}
