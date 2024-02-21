import ZoomManager from './Zoom';
import { AnimationHandler } from './types/Animation';
import { ImageObject, UIElement } from './types/Gullview';
import { allowScroll, blockScroll } from './utils/scroll';

export class UI {
    public animationHandlers: Map<string, AnimationHandler>;
    public isOpen: boolean = false;

    private _zoomManager: ZoomManager;

    private _background: HTMLDivElement;
    private _display: HTMLImageElement;
    private _elements = {} as UIElement;

    constructor() {
        this.animationHandlers = new Map();
        this.background = document.querySelector('.gullview');

        const display = document.createElement('img');
        display.classList.add('gv__display');
        display.setAttribute('alt', 'Gullview display');

        this._display = display;

        this._elements = {
            prev: this.createArrow('prev'),
            next: this.createArrow('next'),
            display: this.display,
        } satisfies UIElement;
        //
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

    public get zoomManager(): ZoomManager {
        return this._zoomManager;
    }

    public set zoomManager(value: ZoomManager) {
        this.display.element.addEventListener('click', value.listener);
        this._zoomManager = value;
    }

    public get display(): UIElement['display'] {
        return {
            element: this._display,
            kind: 'display',
            animation: this.animationHandlers.get('display') || null,
        };
    }

    /**
     * Returns an object of UI elements
     */
    public get elements() {
        return this._elements;
    }

    /**
     * Returns an array of key-value pairs of the UI elements
     */
    public get elementList() {
        return Object.entries(this.elements);
    }

    private get background(): HTMLDivElement {
        return this._background;
    }

    private set background(value: unknown) {
        if (!value)
            throw new Error('No elements with a class of "lightbox" found');

        if (!(value instanceof HTMLDivElement))
            throw new Error('Lightbox must be a div');

        this._background = value;
    }

    private createArrow(dir: 'prev' | 'next'): HTMLButtonElement {
        const arrowContainer = document.createElement('button');

        const leftArrow =
            '<svg xlmns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-arrow-left"><path d="m12 19-7-7 7-7"/><path d="M19 12H5"/></svg>';
        const rightArrow =
            '<svg xlmns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-arrow-right"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>';

        arrowContainer.innerHTML = dir === 'prev' ? leftArrow : rightArrow;

        arrowContainer.classList.add('gv__arrow', dir);
        this.elements[dir] = arrowContainer;
        this.background.appendChild(arrowContainer);
        return arrowContainer;
    }

    public open = ({ target }: MouseEvent) => {
        if (!(target instanceof HTMLImageElement)) return;

        blockScroll();

        if (this.display.animation?.config.morph?.enabled) {
            this.display.animation.morphFrom(target);
        }

        if (this.zoomManager.config.blockNative) this.zoomManager.blockNative();
        this.background.classList.add('show');
        this.isOpen = true;
    };

    public close = (e: MouseEvent) => {
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
