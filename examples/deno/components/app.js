import { Component, css, html } from "./deps.js";
class CustomP extends Component {
    constructor() {
        super(...arguments);
        Object.defineProperty(this, "template", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: html `<p>${this.customText}</p>`
        });
    }
}
Object.defineProperty(CustomP, "styles", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: css `
      p {
        color: red;
      }
    `
});
class AppRoot extends Component {
    constructor() {
        super(...arguments);
        Object.defineProperty(this, "template", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: html `
        <div>
            <${CustomP} prop:customText=${"hello"}></${CustomP}>
        </div>
    `
        });
    }
}
customElements.define("app-root", AppRoot);
