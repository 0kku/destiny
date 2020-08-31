import { DestinyElement, expression, xml } from "/dist/mod.js";
import type { TemplateResult } from "/dist/mod.js";

import { route } from "./hash-router.js";
import { Todo } from "./to-do/_to-do.js";
import { VisitorDemo } from "./visitor-demo.js";
import { ArrayDemo } from "./array-demo.js";
import { TimeDiff } from "./time-diff.js";
import { HashRouter } from "./hash-router.js";

export class TabView extends DestinyElement {
  #tabs = [
    {
      path: "/",
      title: "Visitor demo",
      content: xml`<${VisitorDemo} />`,
    },
    {
      path: "/todo",
      title: "Todo",
      content: xml`<${Todo} />`,
    },
    {
      path: "/array-demo",
      title: "Array demo",
      content: xml`<${ArrayDemo} />`,
    },
    {
      path: "/time-diff",
      title: "Time difference",
      content: xml`<${TimeDiff} />`,
    },
  ];

  render (): TemplateResult {
    return xml/*html*/`
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

      <${HashRouter}>
        ${this.#tabs.map(value => xml`
          <main slot="${value.path}">
            ${value.content}
          </main>
        `)}
        <main slot="404">
          Couldn't find resource "${route}". <br />
          Please check your spelling.
        </main>
      </${HashRouter}>
    `;
  }
}
