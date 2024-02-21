import { DisplayAnimationHandler } from '../animation/Display';

export type AnimationHandler = DisplayAnimationHandler;

export type AnimationDisplayMorphConfig = {
    enabled: boolean;
    duration: number;
};

export type AnimationDisplayConfig = {
    enabled: boolean;
    duration: number;
    next: string;
    prev: string;
    morph: Partial<AnimationDisplayMorphConfig>;
};

export type AnimationConfig = {
    display: AnimationDisplayConfig;
};

export type CounterConfig = {
    enabled: boolean;
    y: 'top' | 'bottom';
    x: 'left' | 'center' | 'right';
};
