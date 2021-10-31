import {expect, JSHandle, Page} from "@playwright/test";
import test, {loadDestiny} from "#dist/tests/inPage.js";

const slices = [
  // positive positive
  [0],
  [0, 2],
  [2, 3],
  [2, 4],
  [3, 2],
  [2],
  [3],
  [0, 100],
  [100, 0],
  [100, 100],
  // negative positive
  [-2],
  [-1],
  [-100, 0],
  // positive negative
  [1, -1],
  [0, -3],
  [0, -100],
  // negative negative
  [-1, -2],
  [-1, -3],
  [-2, -1],
  [-3, -1],
  [-100, -100],
] as const;

const splices = [
  undefined,
  [0, 0],
  [0, 0, 5],
  [0, 0, 5, 6],
  [0, 0, 5, 6, 7, 8],
  [0, 2, 5],
  [0, 5, 5],
  [0, 10, 5],
  [0, 2],
  [0, 5],
  [0, 10],
  [1, 0, 5],
  [1, 2, 5],
  [1, 5, 5],
  [1, 10, 5],
  [1, 2],
  [1, 5],
  [1, 10],
  [-1, 0, 5],
  [-1, 2, 5],
  [-1, 5, 5],
  [-1, 10, 5],
  [-1, 2],
  [-1, 5],
  [-1, 10],
  [4, 0, 5],
  [4, 2, 5],
  [4, 5, 5],
  [4, 10, 5],
  [4, 2],
  [4, 5],
  [4, 10],
  [0],
  [2],
  [-2],
  [4],
] as unknown as ReadonlyArray<undefined | [number]>;

test.describe.serial("slice", () => {
  let destiny: JSHandle<typeof import("/dist/mod.js")>;
  let page: Page;

  test.beforeAll(({destinySerial, pageSerial}) => {
    destiny = destinySerial;
    page = pageSerial;
  });

  for (const splice of splices) {
    for (const slice of slices) {
      test(`splice args: '${String(splice)}', slice args: '${String(slice)}'`, async () => {
        const originalArray = [1, 2, 3, 4];

        const reactiveSlicedArrayValue =
            await page.evaluate(([{reactive}, originalArray, slice, splice]) => {
              const reactiveArray = reactive(originalArray);

              // register the slice first, then splice it to trigger an update.
              const reactiveSlicedArray = reactiveArray.slice(...slice);
              splice && reactiveArray.splice(...splice as [number]);

              return reactiveSlicedArray.value;
            }, [destiny, originalArray, slice, splice] as const);

        splice && originalArray.splice(...splice);
        const originalSlicedArray = originalArray.slice(...slice);
        expect(reactiveSlicedArrayValue).toEqual(originalSlicedArray);
      });
    }
  }
});
