import { Component, expression, xml } from "/dist/mod.js";

import { route, HashRouter } from "./hash-router.js";

export class TabView extends Component {
  #tabs = [
    {
      path: "/",
      title: "Visitor demo",
      content: new URL("./visitor-demo.js", import.meta.url).href,
    },
    {
      path: "/todo",
      title: "Todo",
      content: new URL("./to-do/_to-do.js", import.meta.url).href,
    },
    {
      path: "/array-demo",
      title: "Array demo",
      content: new URL("./array-demo.js", import.meta.url).href,
    },
    {
      path: "/time-difference",
      title: "Time difference",
      content: new URL("./time-diff.js", import.meta.url).href,
    },
    {
      path: "/async",
      title: "Async",
      content: new URL("./async-demo.js", import.meta.url).href,
    },
    {
      path: "/window-manager",
      title: "Windowing demo",
      content: new URL("./window-manager/_window-manager.js", import.meta.url).href,
    },
  ];

  connectedCallback (): void {
    const original = document.title;
    route.bind(path => {
      document.title = this.#tabs.find(v => v.path === path)?.title ?? original;
    });
  }

  template = xml/*html*/`
    <style>
      nav {
        padding: 0;
        padding-left: var(--m);
        display: flex;
        margin: 0;
      }
      a {
        padding: var(--s) var(--m);
        border-top-left-radius: var(--border-radius);
        border-top-right-radius: var(--border-radius);
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
        border-radius: var(--border-radius);
      }
    </style>
    <nav>
      ${this.#tabs.map(({path, title}) => xml`
        <a
          href="#${path}"
          class="${expression`${path} === ${route} && "selected"`}"
        >
          ${title}
        </a>
      `)}
    </nav>

    <main>
      <${HashRouter} prop:routes="${this.#tabs}">
        <div slot="404">
          Couldn't find resource "${route}". <br />
          Please check your spelling.
        </div>
      </${HashRouter}>
    </main>
  `;
}
