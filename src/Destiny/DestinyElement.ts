/**
 * @abstract
 */
export class DestinyElement extends HTMLElement {
  constructor() {
    if (new.target === DestinyElement) {
      throw new TypeError("Can't initialize abstract class.")
    }
    super();
    const shadow = this.attachShadow({ mode: "open" });
    queueMicrotask(() => shadow.appendChild(this.render()));
  }

  render(): Node {
    return new Text;
  }
}
