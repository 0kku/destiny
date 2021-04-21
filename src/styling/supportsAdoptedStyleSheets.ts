export const supportsAdoptedStyleSheets = (
  "adoptedStyleSheets" in Document.prototype &&
  "replace" in CSSStyleSheet.prototype
);
