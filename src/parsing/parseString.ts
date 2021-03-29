const xmlDocument = new DOMParser().parseFromString(
  `<xml
    xmlns="http://www.w3.org/1999/xhtml"
    xmlns:on="p:u"
    xmlns:prop="p:u"
    xmlns:call="p:u"
    xmlns:destiny="p:u"
  />`,
  "application/xhtml+xml",
);
const xmlRange = xmlDocument.createRange();
const xmlRoot = xmlDocument.querySelector("xml")!;
xmlRange.setStart(xmlRoot, 0);
xmlRange.setEnd(xmlRoot, 0);

export function parseString (
  string: string,
): HTMLTemplateElement {
  const templateElement = document.createElement("template");
  templateElement.content.append(
    xmlRange.createContextualFragment(string),
  );

  return templateElement;
}
