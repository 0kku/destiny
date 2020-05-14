import { DestinyElement, html } from "../../mod.js";
import "./tab-view.js";

customElements.define("app-root", class extends DestinyElement {
  render() {
    return html`
      <tab-view></tab-view>
    `;
  }
});