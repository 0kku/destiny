const xmlRange = (
  document
  .implementation
  .createDocument(null, "xml", null)
  .createRange()
);

export function parseString (
  string: string,
  parser: "html" | "xml",
): HTMLTemplateElement {
  const templateElement = document.createElement("template");
  if (parser === "html") {
    templateElement.innerHTML = string;
  } else {
    templateElement.content.append(
      xmlRange.createContextualFragment(string),
    );  
  }

  return templateElement;
}
