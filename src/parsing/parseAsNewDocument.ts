import { namespaces } from "./parseString.js";

export function parseAsNewDocument (
  string: string,
): Document {
  return new DOMParser().parseFromString(
    `<xml ${namespaces}>${string}</xml>`,
    "application/xml",
  );
}
