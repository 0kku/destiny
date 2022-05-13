export type TUnpreparedContentSlot = {
  node: Text;
  slots: Array<{
    index: number;
    start: number;
    end: number;
  }>;
};
