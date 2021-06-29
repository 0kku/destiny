import { Component, html, css } from "../../../mod.ts";

import TabView from "./tab-view.ts";

export class AppRoot extends Component {
  static override styles = css`
    :host {
      --element-color:       #777;
      --element-hover-color: #888;
      --element-focus-color: #999;
      --xl: 48px;
      --l:  32px;
      --m:  16px;
      --s:   8px;
      --xs:  4px;
      --border-radius: 3px;
    }
  `;

  override template = html`
    <${TabView} />
  `;
}
