export type TArrayUpdateArguments<T> = [
  startEditingAt: number,
  deleteCount: number,
  ...newElements: Array<T>,
];
