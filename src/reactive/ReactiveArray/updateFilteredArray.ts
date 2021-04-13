import type { ReactiveArray } from "./_ReactiveArray.js";
import type { TMask } from "./TMask.js";
import type { TMaskEntry } from "./TMaskEntry.js";

type TUpdateQueueEntry<T> = TMaskEntry & {value: T};
type TUpdateQueue<T> = Array<TUpdateQueueEntry<T>>;

const processUpdateQueue = <T>(
  updateQueue: TUpdateQueue<T>,
  filteredArray: ReactiveArray<T>,
) => {
  if (!updateQueue.length) return;

  const addedItems: Array<T> = [];
  let deleteCount = 0;
  for (const item of updateQueue) {
    if (item.show) {
      addedItems.push(item.value);
    } else {
      deleteCount++;
    }
  }
  const startEditingAt = updateQueue.find(v => v.show)?.index ?? updateQueue[0].index + 1;
  filteredArray.splice(
    startEditingAt,
    deleteCount,
    ...addedItems,
  );
  updateQueue.splice(0, updateQueue.length);
};

export const updateFilteredArray = <T>(
  callback: (
    value: T,
    index: number,
    array: Array<T>,
  ) => boolean,
  sourceArray: Array<T>,
  filteredArray: ReactiveArray<T>,
  maskArray: TMask,
): void => {
  let newIndex = -1;
  const updateQueue: TUpdateQueue<T> = [];
  for (const [i, item] of sourceArray.entries()) {
    const showThis = callback(item, i, sourceArray);
    if (showThis) {
      newIndex++;
    }
    if (showThis !== maskArray[i].show) {
      const current = {
        index: newIndex,
        show: showThis,
        value: item,
      };
      updateQueue.push(current);
      maskArray[i] = current;
    } else {
      processUpdateQueue(updateQueue, filteredArray);
    }
  }
  processUpdateQueue(updateQueue, filteredArray);
};
