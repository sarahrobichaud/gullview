import { DisplayAnimationHandler } from "../Animation";
import { AnimationHandler } from "./Animation";

export type ImageObject = {
  parent: HTMLElement;
  index: number;
  image: {
    alt: string;
    src: string;
    elem: HTMLImageElement;
  };
};

interface BaseGVElement<T> {
  animation: T | null;
}

interface GVDisplay extends BaseGVElement<DisplayAnimationHandler> {
  element: HTMLImageElement;
  kind: "display";
}

export const isGVDisplayElement = (elem: unknown): elem is GVDisplay => {
  if (typeof elem !== "object" || elem === null) return false;
  if (!("kind" in elem)) return false;

  return elem.kind === "display";
};

export type UIElement = {
  prev: HTMLButtonElement;
  next: HTMLButtonElement;
  counter: HTMLSpanElement;
  display: GVDisplay;
};
