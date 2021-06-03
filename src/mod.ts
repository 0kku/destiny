export { ReactivePrimitive         } from "./reactive/ReactivePrimitive.ts";
export { ReadonlyReactivePrimitive } from "./reactive/ReactivePrimitive.ts";
export { ReactiveArray             } from "./reactive/ReactiveArray/_ReactiveArray.ts";
export { ReadonlyReactiveArray     } from "./reactive/ReactiveArray/_ReactiveArray.ts";
export { reactiveObject            } from "./reactive/reactiveObject/reactiveObject.ts";
export { reactive                  } from "./reactive/reactive.ts";
export { computed                  } from "./reactive/computed.ts";
export { Component                 } from "./componentLogic/Component.ts";
export { getElementData            } from "./componentLogic/elementData.ts";
export { register                  } from "./componentLogic/register.ts";
export { Ref                       } from "./componentLogic/Ref.ts";
export { classNames                } from "./reactive/classNames.ts";
export { xml, xml as html          } from "./parsing/_xml.ts";
export { css                       } from "./styling/css.ts";
export { CSSTemplate               } from "./styling/CSSTemplate.ts";
export { attachCSSProperties       } from "./styling/attachCSSProperties.ts";

export type { TReactiveValueType } from "./reactive/types/IReactiveValueType.ts";
export type { TReactiveObject    } from "./reactive/types/IReactiveObject.ts";
export type { TReactiveEntity    } from "./reactive/types/IReactiveEntity.ts";
export type { TReactive          } from "./reactive/types/IReactive.ts";
export type { TemplateResult     } from "./parsing/TemplateResult.ts";

// purely so examples are included in the transpiling
import "./_examples/main.ts"
import "./_examples/components/visitor-demo.ts"
import "./_examples/components/to-do/_to-do.ts"
import "./_examples/components/array-demo.ts"
import "./_examples/components/time-diff.ts"
import "./_examples/components/async-demo.ts"
import "./_examples/components/window-manager/_window-manager.ts"