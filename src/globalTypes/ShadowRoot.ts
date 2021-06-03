import "./CSSStyleSheet.ts"

export {}

declare global {
    interface ShadowRoot {
        adoptedStyleSheets: ReadonlyArray<CSSStyleSheet>,
    }
}