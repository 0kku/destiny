export function safeStringifyObject (
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
