import { Component, xml, css, reactive, ReactiveValue } from "/dist/mod.js";

import { Window } from "./window.js";
import type { TWindow } from "./TWindow.js";


type TDirection = "n" | "s" | "e" | "w" | "ne" | "se" | "sw" | "nw";
type TGrabType = TDirection | "move" | "";
const directions = ["s", "n", "e", "w"] as const;

function grabTypeToCursorType (v: TGrabType) {
  switch (v) {
    case "move":
      return "grabbing";
    case "n":
    case "s":
      return "ns-resize";
    case "e":
    case "w":
      return "ew-resize";
    case "ne":
    case "sw":
      return "nesw-resize";
    case "nw":
    case "se":
      return "nwse-resize";
    default:
      return "initial";
  }
}

export class WindowManager extends Component {
  #windows: Array<TWindow> = [
    {
      header: "Foo",
      content: xml`Hello, World!`,
      position: {
        x: reactive(0),
        y: reactive(0),
      },
      size: {
        x: reactive(300),
        y: reactive(200),
      },
    },
    {
      header: "Bar",
      content: xml`Lorem ipsum`,
      position: {
        x: reactive(400),
        y: reactive(50),
      },
      size: {
        x: reactive(250),
        y: reactive(350),
      },
    },
  ];

  #dragging = {
    target: this.#windows[0],
    type: new ReactiveValue<TGrabType>(""),
    positionStart: {
      x: 0,
      y: 0,
    },
    sizeStart: {
      x: 0,
      y: 0,
    },
    pointerStart: {
      x: 0,
      y: 0,
    },
  };
  
  connectedCallback (): void {
    this.addEventListener("mousedown", e => {
      const composed = e.composedPath() as Array<HTMLElement | EventTarget & { matches: undefined }>;
      const targetWindow = composed.find(
        v => v.matches?.(String(Window))
      ) as Window | null;
      if (!targetWindow) return; // event didn't trigger within a window

      const target = composed[0] as HTMLElement;
      const type = 
        target.closest("header")  ? "move" :
        target.closest(".handle") ? directions.filter(c => target.classList.contains(c)).join() as TDirection
        : undefined
      ;
      if (!type) return; // event didn't trigger on something draggable

      const {position, size} = targetWindow.props;

      this.#dragging.type.value = type;
      Object.assign(this.#dragging, {
        target: targetWindow.props,
        positionStart: {
          x: position.x.value,
          y: position.y.value,
        },
        sizeStart: {
          x: size.x.value,
          y: size.y.value,
        },
        pointerStart: {
          x: e.offsetX,
          y: e.offsetY,
        },
      });
    });

    this.addEventListener("mousemove", e => {
      const type = this.#dragging.type.value;
      if (type) {
        const {position, size} = this.#dragging.target;
        const {positionStart, sizeStart, pointerStart} = this.#dragging;
        const deltaPointer = {
          x: pointerStart.x - e.offsetX,
          y: pointerStart.y - e.offsetY,
        };

        if (type === "move") {
          const {x, y} = position;
          x.value = positionStart.x - deltaPointer.x;
          y.value = positionStart.y - deltaPointer.y;
        } else {
          if (type.includes("s")) {
            size.y.value = sizeStart.y - deltaPointer.y;
          }
          if (type.includes("n")) {
            position.y.value = positionStart.y - deltaPointer.y;
            size.y.value = sizeStart.y + deltaPointer.y;
          }
          if (type.includes("e")) {
            size.x.value = sizeStart.x - deltaPointer.x;
          }
          if (type.includes("w")) {
            position.x.value = positionStart.x - deltaPointer.x;
            size.x.value = sizeStart.x + deltaPointer.x;
          }
        }
      }
    });

    window.addEventListener("mouseup", () => this.#dragging.type.value = "");
  }

  constructor () {
    super();

    this.attachCSSProperties({
      "user-select": this.#dragging.type.truthy("none", "initial"),
      cursor: this.#dragging.type.pipe<string>(grabTypeToCursorType),
    });
  }

  static styles = css`
    :host {
      position: relative;
      display: block;
      height: 80vh;
      overflow: hidden;
      outline: 1px dashed red;
      user-select: none;
      cursor: initial;
    }
  `;

  template = xml`
    ${this.#windows.map(win => xml`
      <${Window} prop:props=${win} />
    `)}
  `;
}
