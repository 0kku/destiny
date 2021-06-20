import { Component, computed, html, css, classNames } from "/dist/mod.js";

import HashRouter, { route } from "./hash-router.js";

export default class TabView extends Component {
  #tabs = [
    {
      path: "/",
      title: "Visitor demo",
      content: "./visitor-demo.js",
    },
    {
      path: "/todo",
      title: "Todo",
      content: "./to-do/_to-do.js",
    },
    {
      path: "/array-demo",
      title: "Array demo",
      content: "./array-demo.js",
    },
    {
      path: "/time-difference",
      title: "Time difference",
      content: "./time-diff.js",
    },
    {
      path: "/async",
      title: "Async",
      content: "./async-demo.js",
    },
    {
      path: "/window-manager",
      title: "Windowing demo",
      content: "./window-manager/_window-manager.js",
    },
  ].map(tab => (tab.content = new URL(tab.content, import.meta.url).href, tab));

  connectedCallback (): void {
    const original = document.title;
    route.bind(
      path => {
        document.title = this.#tabs.find(v => v.path === path)?.title ?? original;
      },
      { dependents: [this] },
    );
  }

  static styles = css`
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
  `;

  template = html`
    <nav>
      ${this.#tabs.map(({path, title}) => html`
        <a
          href=${computed`#${path}`}
          class=${classNames({
            selected: computed(() => path === route.value)
          })}
        >
          ${title}
        </a>
      `)}
    </nav>

    <main>
      <${HashRouter} prop:routes=${this.#tabs}>
        <div slot="404">
          Couldn't find resource "${route}". <br />
          Please check your spelling.
        </div>
      </${HashRouter}>
    </main>
  `;
}
