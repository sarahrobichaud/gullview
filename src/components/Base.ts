export default class GVContainer {
    public type = 'base';
    public name = 'container';
    public element: HTMLDivElement;

    constructor(root: Element) {
        if (!root)
            throw new Error('No elements with a class of "lightbox" found');

        if (!(root instanceof HTMLDivElement))
            throw new Error('Lightbox must be a div');

        this.element = root;
    }
}
