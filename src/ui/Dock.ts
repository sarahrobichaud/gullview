import { UI } from '../UI';
import { DockConfig } from '../types/Config';

export class UIElement {
    private prefix = 'gv';
    public element: HTMLElement;

    constructor(
        name: string,
        tag: keyof HTMLElementTagNameMap,
        container: HTMLElement,
        text?: string
    ) {
        const element = document.createElement(tag);
        console.log(
            this.prefix,
            name,
            element.classList,
            element.classList.add(`${this.prefix}__${name}`)
        );

        if (container.classList.contains(`${this.prefix}__dock`)) {
            this.prefix = `${this.prefix}__dock--element`;
            element.classList.add(`${this.prefix}`, `${name}`);
            container.append(element);
        } else {
            element.classList.add(`${this.prefix}__${name}`);
            container.prepend(element);
        }

        if (text) element.textContent = text;

        this.element = element;
    }
}

const defaultDock = {
    enabled: false,
    zoom: false,
    motion: false,
    download: false,
} satisfies DockConfig;

export default class Dock extends UIElement {
    private config = {} as DockConfig;
    private elements: UIElement[] = [];

    constructor(parent: UI, config?: Partial<DockConfig>) {
        super('dock', 'div', parent.background);

        this.config = { ...defaultDock, ...config };

        if (!this.config.enabled) return;

        const { enabled, ...rest } = this.config;

        const elementMap = {
            zoom: ['zoom', 'button', this.element, 'Zoom'],
            motion: ['motion', 'button', this.element, 'Toggle motion'],
            download: ['download', 'button', this.element, 'Download'],
        } satisfies Record<
            keyof Omit<DockConfig, 'enabled'>,
            [string, keyof HTMLElementTagNameMap, HTMLElement, string]
        >;

        Object.entries(rest).forEach(([key, value]) => {
            const [name, tag, container, text] =
                elementMap[key as keyof Omit<DockConfig, 'enabled'>];
            console.log({ key, value });

            if (this.config[key as keyof DockConfig]) {
                this.elements.push(new UIElement(name, tag, container, text));
            }
        });
    }
}
