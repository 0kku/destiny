import { ReactivePrimitive } from "../../../mod.js";
import { computed } from "/dist/reactive/computed.js";

export function resolveAttributeValue (
  val: Array<{
    groups: {
      start?: string,
      index: string,
      after?: string,
    },
  }>,
  props: Array<unknown>,
): unknown {
  let attrVal: unknown;
  if (val.length === 1 && !val[0].groups.start && !val[0].groups.after) {
    // console.log(val[0].groups.index);
    attrVal = props[Number(val[0].groups.index)];
  } else {
    const resolvedValue = val.reduce<{
      items: Array<ReactivePrimitive<unknown>>,
      trailings: Array<string>,
    }>((acc, value) => {
      const item = props[Number(value.groups.index)];
      if (item instanceof ReactivePrimitive) {
        acc.items.push(item);
        acc.trailings.push(value.groups.after ?? "");
      } else {
        acc.trailings[acc.trailings.length - 1] += String(item) + (value.groups.after ?? "");
      }
      
      return acc;
    }, {
      items: [] as Array<ReactivePrimitive<unknown>>,
      trailings: [val[0]?.groups.start ?? ""],
    });

    if (resolvedValue.items.length) {
      attrVal = computed(
        () => resolvedValue.trailings.reduce(
          (a, v, i) => a + String(resolvedValue.items[i].value) + v,
        ),
      );
    } else {
      attrVal = resolvedValue.trailings[0];
    }
  }

  return attrVal;
}
