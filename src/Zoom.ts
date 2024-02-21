import { UI } from './UI';
import { CustomMouseEvent } from './lib/Event';
import { LightboxConfig } from './types/Config';
import Dock from './ui/Dock';
import { offsetPos } from './utils/position';

export type ZoomConfig = {
    enabled: boolean;
    blockNative: boolean;
    baseLevel: number;
};

const defaultZoom = {
    enabled: true,
    baseLevel: 2,
    blockNative: true,
} satisfies ZoomConfig;

export default class ZoomHandler {
    public config = {} as ZoomConfig;
    private _zoomLevel: number;
    public ui: UI;

    public isZoomed = false;

    constructor(ui: UI, config: LightboxConfig['zoom']) {
        this.config = { ...defaultZoom, ...config };
        this.ui = ui;
        this.zoomLevel = 1;

        this.handleCursorOffset = this.handleCursorOffset.bind(this);
    }

    public get zoomLevel() {
        return this._zoomLevel;
    }

    public set zoomLevel(level: number) {
        this._zoomLevel = level;
    }

    private blockZoomHandler(e: WheelEvent) {
        if (e.ctrlKey) e.preventDefault(); //prevent zoom
    }

    public zoom = (
        { offsetX, offsetY }: { offsetX: number; offsetY: number } = {
            offsetX: 0.5,
            offsetY: 0.5,
        },
        level = this.zoomLevel
    ) => {
        if (!this.isZoomed) {
            this.startTrackingMouse();
            this.ui.display.element.style.transformOrigin = `${
                offsetX * 100
            }% ${offsetY * 100}%`;
            this.ui.display.element.classList.add('zoomed');
            this.ui.elements.prev.style.visibility = 'hidden';
            this.ui.elements.next.style.visibility = 'hidden';
            this.ui.display.element.style.transform = `scale(${level})`;
            this.isZoomed = true;
            return;
        }

        this.ui.display.element.style.transform = `scale(${level})`;
        this.zoomLevel = level;
    };

    private handleCursorOffset(e: MouseEvent) {
        const { clientX, clientY } = e;
        const bounds = this.ui.display.element.getBoundingClientRect();
        const offsets = offsetPos(clientX, clientY, bounds);
        this.ui.display.element.style.transformOrigin = `${
            offsets.offsetX * 100
        }% ${offsets.offsetY * 100}%`;
    }

    public unzoom = () => {
        this.stopTrackingMouse();
        this.ui.display.element.classList.remove('zoomed');
        this.ui.display.element.style.transform = '';
        this.ui.display.element.style.transformOrigin = '';
        this.ui.elements.prev.style.visibility = 'visible';
        this.ui.elements.next.style.visibility = 'visible';
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
        if (!(target instanceof HTMLImageElement)) return;

        const bounds = target.getBoundingClientRect();
        const offsets = offsetPos(clientX, clientY, bounds);
        if (!this.isZoomed) {
            this.zoomLevel = this.config.baseLevel;
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
