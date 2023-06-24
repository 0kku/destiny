import { getXmlErrorMessage } from "./getXmlErrorMessage.js";
import { parseAsNewDocument } from "./parseAsNewDocument.js";
import { parseInSafari } from "./parseInSafari.js";

// Different quotes used to prevent having to escape. Probably should look into eventually removing this rule in favor of a formatter.
// eslint-disable-next-line @typescript-eslint/quotes
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
