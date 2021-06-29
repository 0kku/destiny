import { Component, reactive, html, computed } from "../../mod.ts";

function getHashRoute (
  url: string,
) {
  return "/" + new URL(url).hash.replace(/^#\//u, "");
}

export const route = reactive(getHashRoute(window.location.href));

window.addEventListener("hashchange", e => {
  route.value = getHashRoute(e.newURL);
});

export default class HashRouter extends Component<{
  routes: Array<{
    path: string,
    content: string,
  }>,
}> {
  #error404 = html`
    <slot name="404">
      404 — route "${route}" not found
    </slot>
  `;

  override template = computed(() => {
    const routeInfo = this.routes.find(({path}) => path === route.value);
    return (
      routeInfo
      ? html`
        <${import(routeInfo.content)}
          prop:fallback=${html`Loading…`}
          prop:catch=${(err: Error) => html`
            Error loading page: ${err.message}`
          }
        />`
      : this.#error404
    );
  });
}
