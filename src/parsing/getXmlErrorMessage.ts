export function getXmlErrorMessage (
  doc: Document | Element | null,
): string {
  return (
    doc
    ?.firstElementChild
    ?.textContent
    ?? "unknown error"
  );
}
