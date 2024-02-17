import { DisplayAnimationHandler, AnimationDisplayConfig } from "./Animation";
import { UI } from "./UI";
import ZoomManager, { ZoomConfig } from "./Zoom";

import type { LightboxConfig } from "./types/Config";
import { isGVDisplayElement, type ImageObject } from "./types/Gullview";
import Dock, { UIElement } from "./ui/Dock";

export default class Lightbox {
  private _images: Array<ImageObject>;
  private _currentImage: ImageObject;
  public readonly config: LightboxConfig;

  public ui: UI;

  constructor(config: LightboxConfig, ui: UI, images: Element[]) {
    this.ui = ui;
    this.images = images;
    this.config = config;
  }

  public static build(config: LightboxConfig) {
    const images = Array.from(
      document.querySelectorAll(`.${config.targetClass}`)
    );

    const ui = new UI(config.counter, images.length);

    if (config.dock?.enabled) {
      const dock = new Dock(ui, config.dock);
    }

    ui.animationHandlers.set(
      "display",
      new DisplayAnimationHandler(ui.display.element, config.animation?.display)
    );

    ui.zoomManager = new ZoomManager(ui, config.zoom);

    return new Lightbox(config, ui, images);
  }

  get animationHandlers() {
    return this.ui.animationHandlers;
  }

  get currentImage(): ImageObject {
    return this._currentImage;
  }

  set currentImage(value: ImageObject) {
    const jumping =
      (this.currentImage?.index === this.images.length - 1 &&
        value.index === 0) ||
      (this.currentImage?.index === 0 &&
        value.index === this.images.length - 1);

    let direction: "next" | "prev" =
      value.index > this.currentImage?.index ? "next" : "prev";

    if (jumping) direction = direction === "next" ? "prev" : "next";

    this.ui.updateSource(value, !this.ui.isOpen, direction);
    this._currentImage = value;
  }

  get images(): ImageObject[] {
    return this._images;
  }

  set images(value: unknown[]) {
    const imageObjects = value.map((parent, idx) => {
      if (!(parent instanceof HTMLElement))
        throw new Error("Items targeted by lightbox must be HTMLImageElements");

      const elem = parent.querySelector("img");

      if (!(elem instanceof HTMLImageElement))
        throw new Error(
          "Items targeted by lightbox must contain an img element."
        );

      const [src, alt] = [elem.getAttribute("src"), elem.getAttribute("alt")];

      if (!src) throw new Error("Images must have a src and alt attribute.");

      if (!alt) throw new Error("Images must have an alt attribute.");

      return {
        parent,
        index: idx,
        image: {
          src,
          alt,
          elem,
        },
      };
    });

    this._images = imageObjects;
  }

  private handleOpen(e: MouseEvent, element: ImageObject) {
    this.currentImage = element;
    this.ui.open(e, element);
  }

  private handleNext() {
    if (!this.currentImage) return;

    const next =
      this.currentImage.index !== this.images.length - 1
        ? this.images[this.currentImage.index + 1]
        : this.images[0];

    this.currentImage = next;
  }

  private handlePrev() {
    if (!this.currentImage) return;

    const prev =
      this.currentImage.index !== 0
        ? this.images[this.currentImage.index - 1]
        : this.images[this.images.length - 1];

    this.currentImage = prev;
  }

  public init = () => {
    this.images.forEach((element) => {
      element.parent.addEventListener("click", (e) =>
        this.handleOpen(e, element)
      );
    });

    this.ui.elementList.forEach(([key, element]) => {
      if (isGVDisplayElement(element)) return;

      switch (key) {
        case "prev":
          element.addEventListener("click", (e) => {
            e.stopPropagation();
            this.handlePrev();
          });
          break;
        case "next":
          element.addEventListener("click", (e) => {
            e.stopPropagation();
            this.handleNext();
          });
          break;
      }

      // element.addEventListener("click", (e) => {
      //   e.stopPropagtion();
      //   if (element.classList.contains("prev")) this.handlePrev();
      //   if (element.classList.contains("next")) this.handleNext();
      // });
    });
  };
}
