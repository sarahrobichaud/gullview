import GVArrow from '../ui/Arrow';
import GVContainer from '../ui/Base';
import GVCounter from '../ui/Counter';
import GVDisplay from '../ui/Display';

export type ImageObject = {
    parent: HTMLElement;
    index: number;
    image: {
        alt: string;
        src: string;
        elem: HTMLImageElement;
    };
};

export type UIElements = {
    container: GVContainer;
    prev: GVArrow;
    next: GVArrow;
    display: GVDisplay;
};

export type UIElementsWithCounter = UIElements & {
    counter: GVCounter;
};
