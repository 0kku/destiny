import { DestinyElement, html, expression, component } from "../../mod.js";
import { route } from "./hash-router.js";
import "./to-do/_to-do.js";
import "./visitor-demo.js";
import "./array-demo.js";
import "./time-diff.js";
import "./hash-router.js";

component(class TabView extends DestinyElement {
  #tabs = [
    {
      path: "/",
      title: "Visitor demo",
      content: html`<visitor-demo></visitor-demo>`,
    },
    {
      path: "/todo",
      title: "Todo",
      content: html`<to-do></to-do>`,
    },
    {
      path: "/array-demo",
      title: "Array demo",
      content: html`<array-demo></array-demo>`,
    },
    {
      path: "/time-diff",
      title: "Time difference",
      content: html`<time-diff></time-diff>`,
    },
  ];

  render () {
    return html`
      <style>
        :host {
          --m: 16px;
          --s: 8px;
        }
        nav {
          padding: 0;
          padding-left: var(--m);
          display: flex;
          margin: 0;
        }
        a {
          padding: var(--s) var(--m);
          border-top-left-radius: 3px;
          border-top-right-radius: 3px;
          transition: background .2s;
          user-select: none;
          color: white;
          text-decoration: none;
        }
        a:not(.selected):hover {
          background: rgba(255, 255, 255, .06);
          cursor: pointer;
        }
        a:not(.selected):active {
          background: rgba(255, 255, 255, .03);
          cursor: pointer;
        }

        .selected, main {
          background: rgba(255, 255, 255, .1);
        }

        main {
          padding: var(--m);
          border-radius: 3px;
        }
      </style>
      <nav>
        ${this.#tabs.map(({path, title}) => html`
          <a
            href="#${path}"
            class=${expression`${path} === ${route} && "selected"`}
          >
            ${title}
          </a>
        `)}
      </nav>

      <hash-router>
        ${this.#tabs.map(value => html`
          <main slot=${value.path}>
            ${value.content}
          </main>
        `)}
        <main slot=404>
          Couldn't find resource "${route}". <br>
          Please check your spelling.
        </main>
      </hash-router>
    `;
  }
});
