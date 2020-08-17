export function convertSelfClosingElements (
  htmlString: string,
): string {
  return htmlString.replace(
    /<(?<tag>\w[^\s>]*)(?<attrs>(?:\s+[^\s=>]+(?:=(?:[^\s>]+|"[^"]*"|'[^']*'))?)*)\s+\/>/gu,
    "<$<tag>$<attrs>></$<tag>>",
  );
}
