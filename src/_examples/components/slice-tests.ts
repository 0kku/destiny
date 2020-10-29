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
    </style>
    <p>
      <code>const source = ${JSON.stringify(this.#originalArray.value)};</code>
    </p>

    ${this.#splices.map(splice => {
      const source = this.#originalArray.clone();

      return xml`
        <p>
          <code>const source = reactive(${JSON.stringify(this.#originalArray.value)});</code> <br/>
          ${splice
            ? xml`Value of sliced array after <code>source.splice(${splice.join(", ")});</code>:`
            : "Value of sliced array with no splicing"
          }
          ${this.#slices.map(slice => {
            const native = source.value.slice(0);
            const reacativeSplicedArray = source.clone();

            if (splice) {
              [native, reacativeSplicedArray].forEach(a => {
                a.splice(...splice as [number, number]);
              });
            }
            return {slice, native, reacativeSplicedArray};
          }).map(({slice, native, reacativeSplicedArray}) => {
            try {
              const results = [
                reacativeSplicedArray.slice(...slice).value,
                native.slice(...slice),
              ].map(v => JSON.stringify(v));

              return xml`
                <div style="color: ${results[0] === results[1] ? "green": "red"};">
                  <code>source.slice(${slice.join(", ")})</code> got <code>${results[0]}</code>, expected <code>${results[1]}</code>
                </div>
              `;
            } catch (e) {
              return xml`
                <div style="color: red">
                  <code>source.slice(${slice.join(", ")})</code> threw ${e}
                </div>
              `;
            }
          })}
        </p>
      `;
    })}
  `;
}
