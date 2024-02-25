import { DisplayAnimationHandler } from '../animation/Display';
import GVArrow from '../ui/Arrow';
import GVContainer from '../ui/Base';
import GVCounter from '../ui/Counter';
import GVDisplay from '../ui/Display';
import { UIElement } from '../ui/Dock';
import { AnimationHandler } from './Animation';

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

// export interface GVDisplay extends BaseGVElement<DisplayAnimationHandler> {
//     element: HTMLImageElement;
//     kind: 'display';
// }

export const isGVDisplayElement = (elem: unknown): elem is GVDisplay => {
    if (typeof elem !== 'object' || elem === null) return false;
    if (!('kind' in elem)) return false;

    return elem.kind === 'display';
};

export type UIElements = {
    container: GVContainer;
    prev: GVArrow;
    next: GVArrow;
    display: GVDisplay;
    counter?: GVCounter;
};
