import { Component, css, html } from "../../dist/mod.js";

class CustomP extends Component {
    static styles = css`
      p {
        color: red;
      }
    `

    template = html`<p>${this.customText}</p>`
}

class AppRoot extends Component {

    template = html`
        <div>
            <${CustomP} prop:customText=${"hello"}></${CustomP}>
        </div>
    `;
}

customElements.define("app-root", AppRoot)