import { DisplayAnimationHandler } from './animation/Display';
import ZoomManager, { ZoomConfig } from './Zoom';
import { AnimationHandler } from './types/Animation';
import { LightboxConfig, UIConfig } from './types/Config';
import { ImageObject, UIElement } from './types/Gullview';
import { allowScroll, blockScroll } from './utils/scroll';

export class UI {
    private _animationHandlers: Map<string, AnimationHandler>;
    private _zoomManager: ZoomManager;

    private backBackground: HTMLDivElement;
    private _display: HTMLImageElement;
    private _elements = {} as UIElement;

    private backIsOpen: boolean = false;

    private config = {} as UIConfig;
    private totalImages: number;

    constructor(totalImages: number) {
        this._animationHandlers = new Map();
        this.background = document.querySelector('.lightbox');
        this.totalImages = totalImages;

        const display = document.createElement('img');
        display.classList.add('lightbox__display');
        display.setAttribute('alt', 'lightbox display');

        this._display = display;

        this._elements = {
            prev: this.createArrow('prev'),
            next: this.createArrow('next'),
            display: this.display,
        } satisfies UIElement;

        this.background.appendChild(display);

        this.elementList.forEach(([_key, uiElem]) => {
            if (!('animation' in uiElem)) {
                return this.background.appendChild(uiElem);
            } else {
                return this.background.appendChild(uiElem.element);
            }
        });

        this.background.addEventListener('click', this.close.bind(this));
    }

    /* Handlers */

    get animationHandlers() {
        return this._animationHandlers;
    }

    get zoomManager(): ZoomManager {
        return this._zoomManager;
    }

    set zoomManager(value: ZoomManager) {
        this.display.element.addEventListener('click', value.listener);
        this._zoomManager = value;
    }

    get display(): UIElement['display'] {
        return {
            element: this._display,
            kind: 'display',
            animation: this.animationHandlers.get('display') || null,
        };
    }

    /**
     * Returns an object of UI elements
     */
    get elements() {
        return this._elements;
    }

    /**
     * Returns an array of key-value pairs of the UI elements
     */
    get elementList() {
        return Object.entries(this.elements);
    }

    get isOpen() {
        return this.backIsOpen;
    }

    private set isOpen(value: boolean) {
        this.backIsOpen = value;
    }

    get background(): HTMLDivElement {
        return this.backBackground;
    }

    set background(value: unknown) {
        if (!value)
            throw new Error('No elements with a class of "lightbox" found');

        if (!(value instanceof HTMLDivElement))
            throw new Error('Lightbox must be a div');

        this.backBackground = value;
    }

    private createArrow(dir: 'prev' | 'next'): HTMLButtonElement {
        const arrowContainer = document.createElement('button');

        const leftArrow =
            '<svg xlmns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-arrow-left"><path d="m12 19-7-7 7-7"/><path d="M19 12H5"/></svg>';
        const rightArrow =
            '<svg xlmns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-arrow-right"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>';

        arrowContainer.innerHTML = dir === 'prev' ? leftArrow : rightArrow;

        arrowContainer.classList.add('lightbox__arrow', dir);
        this.elements[dir] = arrowContainer;
        this.background.appendChild(arrowContainer);
        return arrowContainer;
    }

    public open = ({ target }: MouseEvent) => {
        if (!(target instanceof HTMLImageElement)) return;

        blockScroll();

        if (this.display.animation?.config.morph?.enabled) {
            console.log('enabled');
            this.display.animation.morphFrom(target);
        }
        console.log('opening');

        if (this.zoomManager.config.blockNative) this.zoomManager.blockNative();
        this.background.classList.add('show');
        this.isOpen = true;
    };

    public close = (e: MouseEvent) => {
        console.log('closing');
        if (!(e.target instanceof HTMLDivElement)) return;

        this.zoomManager.unzoom();
        this.zoomManager.allowNative();
        allowScroll();
        this.isOpen = false;
        this.background.classList.remove('show');
    };

    public updateSource = (
        element: ImageObject,
        skipAnimation: boolean = true,
        direction: 'prev' | 'next' = 'next'
    ) => {
        // Clear old timeouts
        this.display.animation?.clearQueue();

        if (skipAnimation || !this.display.animation?.config.enabled) {
            this.display.element.setAttribute('src', element.image.src);
            this.display.element.setAttribute('alt', element.image.alt);
        } else {
            this.display.animation.swapTo(element, direction);
        }
    };
}
