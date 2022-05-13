import { Renderable } from "../parsing/Renderable.ts";

export function isRenderable (
  input: unknown,
): input is Renderable {
  return (
    Boolean(input)
    && input instanceof Renderable
  );
}
