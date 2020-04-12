export default function isElement(
  input: any
): input is HTMLElement {
  return input.nodeType === Node.ELEMENT_NODE;
}
