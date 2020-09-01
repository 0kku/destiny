import { DestinyElement, reactive, xml, ReactivePrimitive } from "/dist/mod.js";

function getHashRoute (
  url: string,
) {
  return "/" + new URL(url).hash.replace(/^#\//u, "");
}

export const route = reactive(getHashRoute(window.location.href));

window.addEventListener("hashchange", e => {
  route.value = getHashRoute(e.newURL);
});

export class HashRouter extends DestinyElement {
  set routes (
    _: Array<{
      path: string,
      content: string,
    }>,
  ) {}

  #error404 = xml/*html*/`
    <slot name="404">
      404 — route "${route}" not found
    </slot>
  `.content.firstElementChild!;
  #view = new ReactivePrimitive(this.#error404);

  constructor () {
    super();
    route.bind(currentRoute => {
      const routeInfo = this.routes.find(({path}) => path === currentRoute);
      if (routeInfo) {
        this.#view.value = xml`<${import(routeInfo.content)} />`.content.firstElementChild!;
      } else {
        this.#view.value = this.#error404;
      }
    });
  }

  template = xml`
    ${this.#view}
  `;
}
