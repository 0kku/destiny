export {}

declare global {
    interface CSSStyleSheet {
      replace: (cssText: string) => void
    }
  }