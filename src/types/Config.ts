import { AnimationDisplayConfig } from "../Animation";
import { ZoomConfig } from "../Zoom";
import { AnimationConfig } from "./Animation";

export type LightboxConfig = {
  targetClass: string;
  animation?: {
    display?: Partial<AnimationDisplayConfig>;
  };
  zoom?: Partial<ZoomConfig>;
  counter?: Partial<UIConfig["counter"]>;
};

export type UIConfig = {
  animation: AnimationConfig;
  zoom: ZoomConfig;
  counter: {
    show: boolean;
  };
};
