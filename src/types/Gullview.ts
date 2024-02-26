import GVArrow from '@components/Arrow';
import GVContainer from '@components/Base';
import GVCounter from '@components/Counter';
import GVDisplay from '@components/Display';

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
