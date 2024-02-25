import { AnimationDisplayConfig } from '../animation/Display';
import { ZoomConfig } from '../Zoom';
import { AnimationConfig, CounterConfig } from './Animation';

export type LightboxConfig = {
    targetClass: string;
    animation?: {
        display?: Partial<AnimationDisplayConfig>;
    };
    zoom?: Partial<ZoomConfig>;
    counter?: Partial<CounterConfig>;
    display?: Partial<DisplayConfig>;
};

export type DisplayConfig = {
    rounded: boolean;
    animation?: Partial<AnimationDisplayConfig>;
};

export type UIConfig = {
    animation: AnimationConfig;
    zoom: ZoomConfig;
    counter: CounterConfig;
};

export type DockConfig = {
    enabled: boolean;
    zoom: boolean;
    motion: boolean;
    download: boolean;
};
