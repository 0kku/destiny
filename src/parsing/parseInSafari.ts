import { getXmlErrorMessage } from "./getXmlErrorMessage.js";
import { parseAsNewDocument } from "./parseAsNewDocument.js";

export function parseInSafari (
  templateElement: HTMLTemplateElement,
  string: string,
): void {
  const parsed = parseAsNewDocument(string).firstElementChild;

  if (parsed?.firstElementChild?.nodeName.toLowerCase() === "parsererror") {
    throw new SyntaxError(`An error occurred when parsing the following XML:\n${
      string
    }\nwhich resulted in the following message:\n${
      getXmlErrorMessage(parsed)
    }`);
  }

  templateElement.content.append(...parsed?.childNodes ?? []);
}
