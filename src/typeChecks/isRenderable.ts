import { Renderable } from "../parsing/Renderable.js";

export function isRenderable (
  input: unknown,
): input is Renderable {
  return (
    Boolean(input)
    && input instanceof Renderable
  );
}
