import { attribute } from "./attribute.js";
import { destiny } from "./destiny.js";
import { prop } from "./prop.js";
import { call } from "./call.js";
import { on } from "./on.js";

export const attributeNamespaces = new Map([
  ["prop", prop],
  ["call", call],
  ["on", on],
  ["destiny", destiny],
  ["", attribute],
]);
