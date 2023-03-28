import { reactivePropertiesFlag } from "./reactivePropertiesFlag.ts";

export type TReactivePropertiesFlag = {
  readonly [reactivePropertiesFlag]: true;
};
