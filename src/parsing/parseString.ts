import { getXmlErrorMessage } from "./getXmlErrorMessage.ts";
import { parseAsNewDocument } from "./parseAsNewDocument.ts";
import { parseInSafari } from "./parseInSafari.ts";

export const namespaces = `xmlns="http://www.w3.org/1999/xhtml" xmlns:on="p:u" xmlns:prop="p:u" xmlns:destiny="p:u"`;

const xmlDocument = new DOMParser().parseFromString(
  `<xml ${namespaces} />`,
  "application/xhtml+xml",
);
const xmlRange = xmlDocument.createRange();
const xmlRoot = xmlDocument.querySelector("xml")!;
xmlRange.setStart(xmlRoot, 0);
xmlRange.setEnd(xmlRoot, 0);

let notSafari = true;

export function parseString (
  string: string,
): HTMLTemplateElement {
  const templateElement = document.createElement("template");
  if (notSafari) {
    try {
      templateElement.content.append(
        xmlRange.createContextualFragment(string),
      );
    } catch (error) {
      const { message } = error as Error;
      if (message === "The string did not match the expected pattern.") { // Safari
        notSafari = false;
        parseInSafari(templateElement, string);
      } else { // Not Safari
        throw new SyntaxError(`${message}\nat\n${string}\nwhich resulted in the following message:\n${
          getXmlErrorMessage(
            parseAsNewDocument(
              string.replace(/^\n/, ""),
            ),
          )
        }`);
      }
    }
  } else { // Safari
    parseInSafari(templateElement, string);
  }

  return templateElement;
}
