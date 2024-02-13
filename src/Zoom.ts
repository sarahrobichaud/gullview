import { LightboxConfig } from "./Lightbox";
import { UI } from "./UI";
import { offsetPos } from "./utils/position";

export type ZoomConfig = {
  enabled: boolean;
  level: number;
  blockNative: boolean;
};

const defaultZoom = {
  enabled: true,
  level: 2,
  blockNative: true,
} satisfies ZoomConfig;

export default class ZoomHandler {
  public config = {} as ZoomConfig;
  private ui: UI;

  constructor(config: LightboxConfig["zoom"], parent: UI) {
    this.config = { ...defaultZoom, ...config };
    this.ui = parent;

    this.handleCursorOffset = this.handleCursorOffset.bind(this);
    console.log(this.config);
  }

  private blockZoomHandler(e: WheelEvent) {
    if (e.ctrlKey) e.preventDefault(); //prevent zoom
  }

  private zoom({ offsetX, offsetY }, level = this.config.level) {
    this.ui.display.element.style.transformOrigin = `${offsetX * 100}% ${
      offsetY * 100
    }%`;
    this.ui.display.element.classList.add("zoomed");
    this.ui.elements.prev.style.visibility = "hidden";
    this.ui.elements.next.style.visibility = "hidden";
    this.ui.display.element.style.transform = `scale(${level})`;

    window.addEventListener("mousemove", this.handleCursorOffset);
  }

  private handleCursorOffset(e) {
    const { clientX, clientY } = e;
    const bounds = this.ui.display.element.getBoundingClientRect();
    const offsets = offsetPos(clientX, clientY, bounds);
    this.ui.display.element.style.transformOrigin = `${
      offsets.offsetX * 100
    }% ${offsets.offsetY * 100}%`;
  }

  public unzoom = () => {
    this.ui.display.element.classList.remove("zoomed");
    this.ui.display.element.style.transform = "";
    this.ui.elements.prev.style.visibility = "visible";
    this.ui.elements.next.style.visibility = "visible";
    window.removeEventListener("mousemove", this.handleCursorOffset);
  };

  public allowNative = () => {
    document.body.removeEventListener("wheel", this.blockZoomHandler);
  };

  public blockNative = () => {
    const options = { passive: false };

    if (!this.config.blockNative) return;
    document.body.addEventListener("wheel", this.blockZoomHandler, options);
  };

  public listener = ({ clientX, clientY, target }) => {
    const bounds = target.getBoundingClientRect();
    const offsets = offsetPos(clientX, clientY, bounds);
    if (this.ui.display.element.style.transform === "") {
      this.zoom(offsets);
    } else {
      this.unzoom();
    }
  };
}
