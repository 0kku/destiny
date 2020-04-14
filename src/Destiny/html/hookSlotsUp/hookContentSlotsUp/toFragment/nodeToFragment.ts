export function nodeToFragment (
  node: Node,
) {
  const fragment = document.createDocumentFragment();
  fragment.append(node);
  return fragment;
}
