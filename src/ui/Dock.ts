import { UI } from '../UI';
import { DockConfig } from '../types/Config';

export type ModuleType = 'base' | 'core' | 'extra';
export class UIElement<
    TElement extends keyof HTMLElementTagNameMap,
    TType extends ModuleType
> {
    private prefix = 'gv';
    public name: string;
    public type: TType;
    public element: HTMLElementTagNameMap[TElement];

    constructor(name: string, tag: TElement, type: TType) {
        const element = document.createElement(tag);

        element.classList.add(`${this.prefix}__${name}`);

        this.type = type;
        this.name = name;
        this.element = element;
    }
}
// export class DockElement extends UIElement {
//     public dock: Dock;
//     constructor(name: string, tag: keyof HTMLElementTagNameMap, dock: Dock) {
//         if (!(dock.element instanceof HTMLElement))
//             throw new Error('Dock not found');

//         super(`dock--element`, tag, dock.element);
//         this.dock = dock;

//         this.element.classList.add(name);
//     }
// }

// const defaultDock = {
//     enabled: false,
//     zoom: false,
//     motion: false,
//     download: false,
// } satisfies DockConfig;

// export default class Dock extends UIElement {
//     public config = {} as DockConfig;
//     public children: UIElement[] = [];
//     private ui = {} as UI;

//     public isHovered = false;

//     constructor(parent: UI, config?: Partial<DockConfig>) {
//         super('dock', 'div', parent.background);

//         this.config = { ...defaultDock, ...config };
//         this.ui = parent;

//         if (!this.config.enabled) return;
//     }

// }
// private handleMouseEnter = () => {
//     this.isHovered = true;
//     const display = this.ui.display.element;
//     this.ui.zoomManager.stopTrackingMouse();
//     display.classList.add('smooth-origin');
//     display.style.transformOrigin = '50% 50%';
// };

// private handleMouseLeave = ({ clientX, clientY }: MouseEvent) => {
//     this.isHovered = false;
//     const display = this.ui.display.element;

//     const bounds = display.getBoundingClientRect();
//     const offsets = offsetPos(clientX, clientY, bounds);
//     if (this.ui.zoomManager.isZoomed) this.ui.zoomManager.zoom(offsets);

//     // Resume mouse tracking
//     setTimeout(() => {
//         this.ui.zoomManager.startTrackingMouse();
//         display.classList.remove('smooth-origin');
//     }, 1000);
// };
//}

// export class ZoomElement extends DockElement {
//     private zoomHandler: ZoomHandler;
//     private _levelElem;
//     private _plusElem;
//     private _minusElem;

//     constructor(dock: Dock, handler: ZoomHandler) {
//         super('zoom', 'div', dock);
//         this.zoomHandler = handler;

//         this._plusElem = document.createElement('button');
//         this._minusElem = document.createElement('button');
//         this._levelElem = document.createElement('span');

//         const plusText = document.createTextNode('+');
//         const minusText = document.createTextNode('-');
//         const levelText = document.createTextNode(
//             `${this.zoomHandler.zoomLevel}x`
//         );

//         if (this.zoomHandler.zoomLevel === 1) {
//             this._minusElem.disabled = true;
//         }
//         if (this.zoomHandler.zoomLevel === this.zoomHandler.config.maxLevel) {
//             this._plusElem.disabled = true;
//         }

//         this._minusElem.appendChild(minusText);
//         this._levelElem.appendChild(levelText);
//         this._plusElem.appendChild(plusText);

//         this.element.appendChild(this._minusElem);
//         this.element.appendChild(this._levelElem);
//         this.element.appendChild(this._plusElem);

//         this._plusElem.addEventListener('click', this.handleMagnify);
//         this._minusElem.addEventListener('click', this.handleDemagnify);
//     }

//     private handleDemagnify = ({ clientX, clientY }: MouseEvent) => {
//         const bounds =
//             this.zoomHandler.ui.display.element.getBoundingClientRect();
//         const offsets = offsetPos(clientX, clientY, bounds);

//         this.zoomHandler.zoomLevel -= 1;
//         this._plusElem.disabled = false;

//         if (this.zoomHandler.zoomLevel === 1) {
//             this._minusElem.disabled = true;
//         }
//         this.zoomHandler.zoom(offsets);
//     };

//     private handleMagnify = ({ clientX, clientY }: MouseEvent) => {
//         const bounds =
//             this.zoomHandler.ui.display.element.getBoundingClientRect();
//         const offsets = offsetPos(clientX, clientY, bounds);

//         this.zoomHandler.zoomLevel += 1;
//         this._minusElem.disabled = false;

//         if (this.zoomHandler.zoomLevel === this.zoomHandler.config.maxLevel) {
//             this._plusElem.disabled = true;
//         }
//         this.zoomHandler.zoom(offsets);
//     };

//     public updateLevel = (level: number) => {
//         this._levelElem.textContent = `${level}x`;
//     };
// }
