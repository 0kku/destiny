export default function isTextNode (
  input: any,
): input is Text {
  return input.nodeType === Node.TEXT_NODE;
}
