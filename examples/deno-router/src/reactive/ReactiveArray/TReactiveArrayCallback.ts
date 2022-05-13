export type TReactiveArrayCallback<T, R = void> = (
  index: number,
  deleteCount: number,
  ...values: Array<T>
) => R;
