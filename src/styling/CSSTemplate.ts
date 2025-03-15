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

  #styleSheet: CSSStyleSheet | undefined;
  get styleSheet (): CSSStyleSheet {
    if (!this.#styleSheet) {
      this.#styleSheet = new CSSStyleSheet;
      void this.#styleSheet.replaceSync(this.cssText);
    }
    return this.#styleSheet;
  }
}
