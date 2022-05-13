/**
 * Checks if a given node is a DOM HTMLElement.
 * @param input The item to be checked
 */
export function isElement(
  input: Node,
): input is HTMLElement {
  return input.nodeType === Node.ELEMENT_NODE;
}
