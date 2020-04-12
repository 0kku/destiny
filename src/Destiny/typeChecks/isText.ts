export default function isText(
  input: any,
): input is Text {
  return input.nodeType === Node.TEXT_NODE;
}