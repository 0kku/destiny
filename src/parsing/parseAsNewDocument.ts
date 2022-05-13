import { namespaces } from "./parseString.ts";

export function parseAsNewDocument(
  string: string,
): Document {
  return new DOMParser().parseFromString(
    `<xml ${namespaces}>${string}</xml>`,
    "application/xml",
  );
}
