export const deferredElements: Map<
  HTMLElement,
  (element: HTMLElement) => Promise<void>
> = new Map;
