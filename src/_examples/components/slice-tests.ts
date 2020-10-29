import { DestinyElement, xml, reactive } from "/dist/mod.js";

export class SliceTests extends DestinyElement {
  #originalArray = reactive([1, 2, 3, 4]);

  #slices = [
    [0],
    [0, 2],
    [2, 3],
    [2, 4],
    [3, 2],
    [2],
    [-2],
    [-1, -2],
    [-2, -1],
    [0, -100],
    [-100, 0],
    [-100, -100],
    [0, 100],
    [100, 0],
    [100, 100],
  ] as const;

  #splices = [
    undefined,
    [0, 0],
    [0, 0, 5],
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
  ];
  
  template = xml`
    <style>
      code {
        background: #0002;
        padding: 1px 3px;
        border-radius: 2px;
      }

      details {
        margin: 12px 0;
      }
    </style>
    <p>
      <code>const source = reactive(${JSON.stringify(this.#originalArray.value)});</code>
    </p>

    ${this.#splices.map(splice => {
      const tests = this.#slices.map(slice => {
        const nativeSourceArray = this.#originalArray.value.slice(0);
        if (splice) {
          nativeSourceArray.splice(...splice as [number]);
        }
        const nativeSlicedArray = nativeSourceArray.slice(...slice);

        const reactiveSourceArray = this.#originalArray.clone();
        const reactiveSlicedArray = reactiveSourceArray.slice(...slice);
        if (splice) {
          console.log("reactiveSlicedArray before splice", JSON.stringify(reactiveSlicedArray.value));
          reactiveSourceArray.splice(...splice as [number]);
          console.log("reactiveSlicedArray after splice", JSON.stringify(reactiveSlicedArray.value));
        }

        try {
          const results = [
            reactiveSlicedArray.value,
            nativeSlicedArray,
          ].map(v => JSON.stringify(v));

          const passed = results[0] === results[1];
          if (!passed) {
            console.error(`source.slice(${slice.join(", ")}) with splice(${(splice ?? []).join(", ")}): got ${results[0]}, expected ${results[1]}`);
          }

          return {
            passed,
            fragment: xml`
              <div style="color: ${passed ? "green": "red"};">
                <code>source.slice(${slice.join(", ")})</code> got <code>${results[0]}</code>, expected <code>${results[1]}</code>
              </div>
            `,
          } as const;
        } catch (e) {
          console.error(e);
          return {
            passed: false,
            fragment: xml`
              <div style="color: red">
                <code>source.slice(${slice.join(", ")})</code> threw ${e}
              </div>
            `,
          } as const;
        }
      });

      const allTestsPassed = tests.every(({passed}) => passed);

      return xml`
        <hr />
        <details prop:open="${!allTestsPassed}">
          <summary>
            ${allTestsPassed ? "✅" : "❌"}
            ${splice
              ? xml`Value of sliced array after <code>source.splice(${splice.join(", ")})</code>:`
              : "Value of sliced array with no splicing"
            }
          </summary>
          ${tests.map(({fragment}) => fragment)}
        </details>
      `;
    })}
  `;
}
