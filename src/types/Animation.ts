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
