export type ModuleType = 'base' | 'core' | 'extra';

export class GVModule<
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
