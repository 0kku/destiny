import { DestinyElement, html, reactive } from "../../mod.js";

function getHashRoute (
  url: string,
) {
  return "/" + new URL(url).hash.replace(/^#\//u, "");
}

export const route = reactive(getHashRoute(window.location.href));

window.addEventListener("hashchange", e => {
  route.value = getHashRoute(e.newURL);
});

customElements.define("hash-router", class extends DestinyElement {
  render() {
    return html`
      <slot name=${route}>
        <slot name=404>
          404 — route "${route}" not found
        </slot>
      </slot>
    `;
  }
});
