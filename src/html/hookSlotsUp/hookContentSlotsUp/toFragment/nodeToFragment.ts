/**
 * Converts a `Node` into a `DocumentFragment`.
 * @param node The `Node` to be converted
 */
export function nodeToFragment (
  node: Node,
) {
  const fragment = new DocumentFragment;
  fragment.append(node);
  return fragment;
}
