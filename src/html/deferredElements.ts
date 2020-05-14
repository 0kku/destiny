/**
 * Lists elements which are to be waited on before removal. See `attributeNamespaces/destiny.js` for details (`destiny:out`).
 */
export const deferredElements: Map<
  HTMLElement,
  (element: HTMLElement) => Promise<void>
> = new Map;
