import { DestinyElement, html } from "../Destiny/_Destiny.js";
import "./tab-view.js";

customElements.define("app-root", class extends DestinyElement {
  render() {
    return html`
      <tab-view></tab-view>
    `;
  }
});