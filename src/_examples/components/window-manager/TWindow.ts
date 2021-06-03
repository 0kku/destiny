import type { ReactivePrimitive, TemplateResult } from "../../../mod.ts";

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
