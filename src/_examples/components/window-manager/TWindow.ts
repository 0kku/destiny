import type { ReactivePrimitive, TemplateResult } from "/dist/mod.js";

export type TWindow = {
  header: string,
  content: TemplateResult,
  position: {
    x: ReactivePrimitive<number>,
    y: ReactivePrimitive<number>,
  },
  size: {
    x: ReactivePrimitive<number>,
    y: ReactivePrimitive<number>,
  },
};
