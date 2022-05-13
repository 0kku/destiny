import { Component, xml } from "../src/mod.js";
export default class Bye extends Component {
    constructor() {
        super(...arguments);
        Object.defineProperty(this, "template", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: xml `
      <p>bye</p>
    `
        });
    }
}
