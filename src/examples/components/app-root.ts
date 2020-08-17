import { DestinyElement, html, component } from "../../mod.js";
import "./tab-view.js";

component(class AppRoot extends DestinyElement {
  render () {
    return html`
      <tab-view></tab-view>
    `;
  }
});