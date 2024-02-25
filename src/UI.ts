import { LightboxConfig } from '@/types/Config';
import {
    ImageObject,
    UIElements,
    UIElementsWithCounter,
} from '@/types/Gullview';

import ZoomManager from '@/Zoom';

import GVArrow from '@components/Arrow';
import GVRoot from '@components/Base';
import GVCounter from '@components/Counter';
import GVDisplay from '@components/Display';
import { ModuleType } from '@components/GVModule';

import { allowScroll, blockScroll } from '@utils/scroll';

import defaults from '@config/defaults';

export class UI {
    public isOpen: boolean = false;

    private _zoomManager: ZoomManager;

    private background: HTMLDivElement;
    private _elements = {} as UIElements | UIElementsWithCounter;

    constructor(config: LightboxConfig) {
        const { display: displayConfig, counter: counterConfig } = {
            ...defaults,
            ...config,
        };

        const root = new GVRoot(document.querySelector('.gullview')!);
        // Setup core
        this._elements.prev = new GVArrow('prev');
        this._elements.next = new GVArrow('next');
        this._elements.display = new GVDisplay(displayConfig);

        if (counterConfig.enabled) {
            (this._elements as UIElementsWithCounter).counter = new GVCounter(
                counterConfig
            );
        }

        this.modules('core').forEach((module) => {
            root.element.prepend(module.element);
        });
        root.element.append(this.elements.display.element);

        // Setup extra
        // this._elements.counter = new GVCounter();
        this.background = root.element;

        // Extra
        this.modules('extra').forEach((module) => {
            root.element.prepend(module.element);
        });

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
