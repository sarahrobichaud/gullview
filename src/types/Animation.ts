import { DisplayAnimationHandler } from "../Animation";

export type AnimationHandler = DisplayAnimationHandler;

export type AnimationDisplayConfig = {
  enabled: boolean;
  duration: number;
  next: string;
  prev: string;
};

export type AnimationConfig = {
  display: AnimationDisplayConfig;
};

export type CounterConfig = {
  enabled: boolean;
  y: "top" | "bottom";
  x: "left" | "center" | "right";
};
