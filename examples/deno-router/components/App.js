import { Component, register, xml, Router, Route } from "../src/mod.js";
class AppRoot extends Component {
    constructor() {
        super(...arguments);
        Object.defineProperty(this, "template", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: xml `
      <${Router}>
        <${Route} prop:path=${"/"} prop:content=${"/components/landing.js"}></${Route}>
        <${Route} prop:path=${"/drash/:version?"} prop:content=${"/components/drash.js"}></${Route}>
      </${Router}>
    `
        });
    }
}
register(AppRoot);
