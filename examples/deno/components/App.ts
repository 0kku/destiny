import { Component, css, html, register } from "../../../src/mod.ts";

class CustomP extends Component<{
    customText: string
}> {
    static override styles = css`
      p {
        color: red;
      }
    `

    template = html`<p>${this.customText}</p>`
}

class AppRoot extends Component {

    override template = html`
        <div>
            <${CustomP} prop:customText=${"hello"}></${CustomP}>
        </div>
    `;
}

register(AppRoot)