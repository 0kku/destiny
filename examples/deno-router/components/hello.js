import { Component, xml } from "../src/mod.js";
export default class Hello extends Component {
    constructor() {
        super(...arguments);
        Object.defineProperty(this, "template", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: xml `
      <p>hello</p>
    `
        });
    }
}
