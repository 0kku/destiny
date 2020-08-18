import { DestinyElement, html, component } from "../../mod.js";
import "./tab-view.js";

component(class AppRoot extends DestinyElement {
  render () {
    return html`
      <style>
        :host {
          --element-color: #777;
          --element-hover-color: #888;
          --element-focus-color: #999;
          --xl: 48px;
          --l:  32px;
          --m:  16px;
          --s:   8px;
          --xs:  4px;
          --border-radius: 3px;
        }
      </style>
      <tab-view></tab-view>
    `;
  }
});