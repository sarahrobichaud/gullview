/** Global */
export type LightboxConfig = {
    targetClass?: string;
    animation?: {
        display?: Partial<AnimationDisplayConfig>;
    };
    zoom?: Partial<ZoomConfig>;
    counter?: Partial<CounterConfig>;
    display?: Partial<DisplayConfig>;
};

/** Display */
export type DisplayConfig = {
    rounded: boolean;
    animation?: Partial<AnimationDisplayConfig>;
};

export type AnimationDisplayMorphConfig = {
    enabled: boolean;
    duration: number;
};

export type AnimationDisplayConfig = {
    enabled: boolean;
    duration: number;
    keyframes_next: string;
    keyframes_prev: string;
    morph: Partial<AnimationDisplayMorphConfig>;
};

/** Counter */

type CounterXPosition = 'left' | 'center' | 'right';
type CounterYPosition = 'top' | 'bottom';

export type CounterConfig = {
    enabled: boolean;
    y: CounterYPosition;
    x: CounterXPosition;
    animation?: Partial<AnimationCounterConfig>;
};

export type AnimationCounterConfig = {
    enabled: boolean;
    duration: number;
    keyframes_updateCurrent: string;
};

/** Zoom */

export type ZoomConfig = {
    enabled: boolean;
    blockNative: boolean;
    level: number;
};

/** Dock */

export type DockConfig = {
    enabled: boolean;
    zoom: boolean;
    motion: boolean;
    download: boolean;
};
