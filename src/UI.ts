import ZoomManager from './Zoom';
import { AnimationHandler } from './types/Animation';
import { LightboxConfig } from './types/Config';
import { ImageObject, UIElements } from './types/Gullview';
import GVArrow from './ui/Arrow';
import GVRoot from './ui/Base';
import GVCounter from './ui/Counter';
import GVDisplay from './ui/Display';
import { ModuleType } from './ui/Dock';
import { allowScroll, blockScroll } from './utils/scroll';

export class UI {
    public animationHandlers: Map<string, AnimationHandler>;
    public isOpen: boolean = false;

    private _zoomManager: ZoomManager;

    private background: HTMLDivElement;
    private _elements = {} as UIElements;

    constructor(displayConfig: LightboxConfig['display']) {
        // Setup root
        const root = new GVRoot(document.querySelector('.gullview')!);

        // Setup core
        this._elements.prev = new GVArrow('prev');
        this._elements.next = new GVArrow('next');
        this._elements.display = new GVDisplay(displayConfig);

        // Setup extra
        this._elements.counter = new GVCounter();

        root.element.appendChild(this.elements.display.element);

        this.background = root.element;

        this.modules('core').forEach((module) => {
            root.element.appendChild(module.element);
        });

        console.log(this.modules('base'));
        console.log(this.modules('core'));
        console.log(this.modules('extra'));

        root.element.addEventListener('click', this.close.bind(this));
    }

    public get zoomManager(): ZoomManager {
        return this._zoomManager;
    }

    public set zoomManager(value: ZoomManager) {
        if (value.config.enabled) {
            this.display.element.addEventListener('click', value.listener);
            this.display.element.classList.add('zoomable');
        }

        this._zoomManager = value;
    }

    private get display(): GVDisplay {
        if (!this._elements.display)
            throw new Error('Display not initialized properly.');

        return this._elements.display;
    }
    /**
     * Returns an object of UI elements
     */
    public get elements() {
        return this._elements;
    }

    public modules = (type: ModuleType) => {
        return Object.values(this._elements).filter(
            (element) => element.type === type
        );
    };
    /**
     * Returns an array of key-value pairs of the UI elements
     */
    public get elementList() {
        return Object.entries(this.elements);
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
