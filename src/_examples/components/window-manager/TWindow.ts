import type { ReactiveValue, TemplateResult } from "/dist/mod.js";

export type TWindow = {
  header: string,
  content: TemplateResult,
  position: {
    x: ReactiveValue<number>,
    y: ReactiveValue<number>,
  },
  size: {
    x: ReactiveValue<number>,
    y: ReactiveValue<number>,
  },
};
