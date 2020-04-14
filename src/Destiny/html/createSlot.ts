export function createSlot (
  node: ChildNode,
) {
  let nodes = [node];
  return (fragment: DocumentFragment) => {
    const placeholder = nodes.pop()!;
    for (const node of nodes) node.remove();
    if (!fragment.childNodes.length) {
      fragment.append(new Comment("Destiny slot placeholder"));
    }
    nodes = Object.values(fragment.childNodes);
    placeholder.replaceWith(fragment);
  }
}
