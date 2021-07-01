// eslint-disable-next-line @typescript-eslint/triple-slash-reference
/// <reference path="./globalThis.d.ts" />

export { ReactiveValue             } from "./reactive/ReactiveValue/_ReactiveValue.ts";
export { ReadonlyReactiveValue     } from "./reactive/ReactiveValue/_ReadonlyReactiveValue.ts";
export { ReactiveArray             } from "./reactive/ReactiveArray/_ReactiveArray.ts";
export { ReadonlyReactiveArray     } from "./reactive/ReactiveArray/_ReadonlyReactiveArray.ts";
export { makeReactiveProperties    } from "./reactive/reactiveProperties/makeReactiveProperties.ts";
export { reactive                  } from "./reactive/reactive.ts";
export { computed                  } from "./reactive/computed.ts";
export { xml, xml as html          } from "./parsing/_xml.ts";
export { Component                 } from "./componentLogic/Component.ts";
export { getElementData            } from "./componentLogic/elementData.ts";
export { register                  } from "./componentLogic/register.ts";
export { Ref                       } from "./componentLogic/Ref.ts";
export { classNames                } from "./reactive/classNames.ts";
export { css                       } from "./styling/css.ts";
export { CSSTemplate               } from "./styling/CSSTemplate.ts";
export { attachCSSProperties       } from "./styling/attachCSSProperties.ts";

export type { TReactiveValueType      } from "./reactive/types/TReactiveValueType.ts";
export type { TMakeReactiveProperties } from "./reactive/reactiveProperties/TMakeReactiveProperties.ts";
export type { TReactiveEntity         } from "./reactive/types/TReactiveEntity.ts";
export type { TReactive               } from "./reactive/types/TReactive.ts";
export type { TemplateResult          } from "./parsing/TemplateResult.ts";

// Import some example files that aren't included in the dependency free, so we can compile them
import "./_examples/main.ts"
import "./_examples/components/visitor-demo.ts"
import "./_examples/components/to-do/_to-do.ts"
import "./_examples/components/array-demo.ts"
import "./_examples/components/time-diff.ts"
import "./_examples/components/async-demo.ts"
import "./_examples/components/window-manager/_window-manager.ts"
