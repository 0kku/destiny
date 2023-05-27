export class CSSTemplate {
  readonly cssText: string;

  constructor (
    cssText: string,
  ) {
    this.cssText = cssText;
  }

  get styleElement (): HTMLStyleElement {
    return Object.assign(
      document.createElement("style"),
      { textContent: this.cssText },
    );
  }

  #stylesheet: CSSStyleSheet | undefined;
  get styleSheet (): CSSStyleSheet {
    if (!this.#stylesheet) {
      this.#stylesheet = new CSSStyleSheet;
      void this.#stylesheet.replace(this.cssText);
    }
    return this.#stylesheet;
  }
}
