import { DisplayAnimationHandler } from '../animation/Display';

export type AnimationHandler = DisplayAnimationHandler;

export type AnimationDisplayMorphConfig = {
    duration: number;
};

export type AnimationDisplayConfig = {
    enabled: boolean;
    duration: number;
    next: string;
    prev: string;
    morph: AnimationDisplayMorphConfig;
};

export type AnimationConfig = {
    display: AnimationDisplayConfig;
};

export type CounterConfig = {
    enabled: boolean;
    y: 'top' | 'bottom';
    x: 'left' | 'center' | 'right';
};
