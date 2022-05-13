/**
 * Checks if a given Node is a DOM Text node.
 * @param input The item to be checked
 */
export function isTextNode (
  input: Node,
): input is Text {
  return input.nodeType === Node.TEXT_NODE;
}
