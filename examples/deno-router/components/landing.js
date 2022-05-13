import { Component, xml } from "../src/mod.js";
export default class Landing extends Component {
    constructor() {
        super(...arguments);
        Object.defineProperty(this, "template", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: xml `<p>landing</p>`
        });
    }
}
