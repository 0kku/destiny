/* eslint-disable @typescript-eslint/naming-convention */
import { computed } from "../../../reactive/computed.js";
import { Component, css, html, reactive } from "/dist/mod.js";

const originalArray = [1, 2, 3, 4] as const;
type TSpliceArguments = undefined | [number, ...Array<number>];
type TSliceArguments = [number] | [number, number];
const tests = {
  ReadonlyReactiveArray: {
    slice: {
      action: (splice: TSpliceArguments) => (slice: TSliceArguments) => {
        const nativeSourceArray = originalArray.slice(0);
        if (splice) {
          nativeSourceArray.splice(...splice);
        }
        const nativeSlicedArray = nativeSourceArray.slice(...slice);

        const reactiveSourceArray = reactive(originalArray as unknown as Array<number>);
        const reactiveSlicedArray = reactiveSourceArray.slice(...slice);
        if (splice) {
          // console.log("reactiveSlicedArray before splice", JSON.stringify(reactiveSlicedArray.value));
          reactiveSourceArray.splice(...splice);
          // console.log("reactiveSlicedArray after splice", JSON.stringify(reactiveSlicedArray.value));
        }

        try {
          const results = [
            reactiveSlicedArray.value,
            nativeSlicedArray,
          ].map(v => JSON.stringify(v));

          const passed = results[0] === results[1];
          if (!passed) {
            console.error(`source.slice(${slice.join(", ")}) with splice(${(splice ?? []).join(", ")}): got ${results[0]!}, expected ${results[1]!}`);
          }

          return {
            passed,
            arguments: slice,
            result: results[0],
            expected: results[1],
          } as const;
        } catch (e) {
          console.error(e);
          return {
            passed: false,
            arguments: slice,
            result: undefined,
            expected: undefined,
            error: e as unknown,
          } as const;
        }
      },
      arguments: [
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
      ] as const,
    },
  },
  ReactiveArray: {
    splice: {
      arguments: [
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
      ] as unknown as ReadonlyArray<undefined | [number]>,
    }
  },
} as const;

export default class TestRunner extends Component {
  #originalArray = [1, 2, 3, 4] as const;

  #slices = [
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

  #splices = [
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

  static override styles = css`
    code {
      background: #0002;
      padding: 1px 3px;
      border-radius: 2px;
    }

    details {
      margin: 12px 0;
    }
  `;
  
  override template = html`
    <p>
      <code>const source = reactive(${JSON.stringify(this.#originalArray)});</code>
    </p>

    ${this.#splices.map(splice => {
      const tests = this.#slices.map(slice => {
        const nativeSourceArray = this.#originalArray.slice(0);
        if (splice) {
          nativeSourceArray.splice(...splice);
        }
        const nativeSlicedArray = nativeSourceArray.slice(...slice);

        const reactiveSourceArray = reactive(this.#originalArray as unknown as Array<number>);
        const reactiveSlicedArray = reactiveSourceArray.slice(...slice);
        if (splice) {
          // console.log("reactiveSlicedArray before splice", JSON.stringify(reactiveSlicedArray.value));
          reactiveSourceArray.splice(...splice);
          // console.log("reactiveSlicedArray after splice", JSON.stringify(reactiveSlicedArray.value));
        }

        try {
          const results = [
            reactiveSlicedArray.value,
            nativeSlicedArray,
          ].map(v => JSON.stringify(v));

          const passed = results[0] === results[1];
          if (!passed) {
            console.error(`source.slice(${slice.join(", ")}) with splice(${(splice ?? []).join(", ")}): got ${results[0]!}, expected ${results[1]!}`);
          }

          return {
            passed,
            fragment: html`
              <div style=${computed`color: ${passed ? "green": "red"};`}>
                <code>source.slice(${slice.join(", ")})</code> got <code>${results[0]}</code>, expected <code>${results[1]}</code>
              </div>
            `,
          } as const;
        } catch (e) {
          console.error(e);
          return {
            passed: false,
            fragment: html`
              <div style="color: red;">
                <code>source.slice(${slice.join(", ")})</code> threw ${e}
              </div>
            `,
          } as const;
        }
      });

      const allTestsPassed = tests.every(({passed}) => passed);

      return html`
        <hr />
        <details prop:open=${!allTestsPassed}>
          <summary>
            ${allTestsPassed ? "✅" : "❌"}
            ${splice
              ? html`Value of sliced array after <code>source.splice(${splice.join(", ")})</code>:`
              : "Value of sliced array with no splicing"
            }
          </summary>
          ${tests.map(({fragment}) => fragment)}
        </details>
      `;
    })}
  `;
}
