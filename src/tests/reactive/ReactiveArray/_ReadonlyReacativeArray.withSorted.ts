import {expect, JSHandle, Page} from "@playwright/test";
import test from "#dist/tests/inPage.js";

const splices = [
  // undefined,
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
] as unknown as ReadonlyArray<undefined | readonly [number]>;

const withSortStringArgs = [
  [],
  // [(a: number, b: number) => a - b],
  // [(a: number, b: number) => b - a],
] as const;

test.describe.serial("withSort", () => {
  let destiny: JSHandle<typeof import("/dist/mod.js")>;
  let page: Page;

  test.beforeAll(({destiny: _destiny, page: _page}) => {
    destiny = _destiny;
    page = _page;
  });

  for (const withSortStringArg of withSortStringArgs) {
    for (const splice of splices) {
      test(`splice args: '${String(splice)}', sort args: '${String(withSortStringArg)}'`, async () => {
        const originalArray = [1, 2, 3, 4];

        const reactiveSortedArrayValue = await page.evaluate(
          ([{reactive}, originalArray, withSortStringArg, splice]) => {
            const reactiveArray = reactive(originalArray);

            // register the sort first, then splice it to trigger an update.
            const reactiveSortedArray = reactiveArray.withSorted(...withSortStringArg);
            splice && reactiveArray.splice(...splice);

            return reactiveSortedArray.value;
          },
          [destiny, originalArray, withSortStringArg, splice] as const,
        );

        splice && originalArray.splice(...splice);
        const originalSortedArray = originalArray.sort(...withSortStringArg);
        expect(reactiveSortedArrayValue).toEqual(originalSortedArray);
      });
    }
  }
});
