// eslint-disable-next-line @typescript-eslint/no-invalid-void-type
export type TReactiveArrayCallback<T, R = void> = (
  index: number,
  deleteCount: number,
  ...values: Array<T>
) => R;
