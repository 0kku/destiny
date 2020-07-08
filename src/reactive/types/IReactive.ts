import { ReactiveArray, ReactivePrimitive } from "../../mod.js";

export type IReactive<T> = ReactiveArray<T> | ReactivePrimitive<T> | object;
