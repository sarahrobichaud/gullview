import { UI } from './UI';
import { LightboxConfig, ZoomConfig } from '@/types/Config';
import { offsetPos } from './utils/position';

import defaults from './config/defaults';

export default class ZoomHandler {
    public readonly config = {} as ZoomConfig;
    public isZoomed = false;
    public ui: UI;
    public zoomLevel: number;

    constructor(ui: UI, config: LightboxConfig['zoom']) {
        this.config = { ...defaults.zoom, ...config };
        this.ui = ui;
        this.zoomLevel = 1;

        this.handleCursorOffset = this.handleCursorOffset.bind(this);
    }

    private blockZoomHandler(e: WheelEvent) {
        if (e.ctrlKey) e.preventDefault(); //prevent zoom
    }

    private handleCursorOffset(e: MouseEvent) {
        const { element } = this.ui.elements.display;
        const { clientX, clientY } = e;
        const bounds = element.getBoundingClientRect();
        const offsets = offsetPos(clientX, clientY, bounds);
        element.style.transformOrigin = `${offsets.offsetX * 100}% ${
            offsets.offsetY * 100
        }%`;
    }

    public zoom = (
        { offsetX, offsetY }: { offsetX: number; offsetY: number } = {
            offsetX: 0.5,
            offsetY: 0.5,
        },
        level = this.zoomLevel
    ) => {
        const { display, next, prev } = this.ui.elements;
        if (!this.config.enabled) return;
        if (!this.isZoomed) {
            this.startTrackingMouse();
            display.element.style.transformOrigin = `${offsetX * 100}% ${
                offsetY * 100
            }%`;
            display.element.classList.add('zoomed');
            prev.element.style.visibility = 'hidden';
            next.element.style.visibility = 'hidden';
            display.element.style.transform = `scale(${level})`;
            this.isZoomed = true;
            return;
        }

        display.element.style.transform = `scale(${level})`;
        this.zoomLevel = level;
    };

    public unzoom = () => {
        const { display, next, prev } = this.ui.elements;
        this.stopTrackingMouse();
        display.element.classList.remove('zoomed');
        display.element.style.transform = '';
        prev.element.style.visibility = 'visible';
        next.element.style.visibility = 'visible';

        setTimeout(() => {
            display.element.style.transformOrigin = '';
        }, 200);
        this.zoomLevel = 1;
        this.isZoomed = false;
    };

    public stopTrackingMouse = () => {
        window.removeEventListener('mousemove', this.handleCursorOffset);
    };

    public startTrackingMouse = () => {
        window.addEventListener('mousemove', this.handleCursorOffset);
    };

    public allowNative = () => {
        document.body.removeEventListener('wheel', this.blockZoomHandler);
    };

    public blockNative = () => {
        const options = { passive: false };

        if (!this.config.blockNative) return;
        document.body.addEventListener('wheel', this.blockZoomHandler, options);
    };

    public listener = ({ clientX, clientY, target }: MouseEvent) => {
        if (!this.config.enabled) return;

        if (!(target instanceof HTMLImageElement)) return;

        const bounds = target.getBoundingClientRect();
        const offsets = offsetPos(clientX, clientY, bounds);
        if (!this.isZoomed) {
            this.zoomLevel = this.config.level;
            this.zoom(offsets);
        } else {
            this.unzoom();
        }
    };
    // public createDockElement = (dock: Dock) => {
    //     const element = new ZoomElement(dock, this);
    //     this.element = element;
    //     return this.element;
    // };
}
