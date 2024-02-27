import GVArrow from '@components/Arrow';
import defaults from '@config/defaults';
import ZoomManager from '@/Zoom';

import { UI } from '@/UI';

import type { ImageObject } from '@/types/Gullview';
import type { LightboxConfig } from '@/types/Config';

export default class Gullview {
    private _images: Array<ImageObject>;
    private _currentImage: ImageObject;
    public readonly config: LightboxConfig;

    public ui: UI;

    constructor(config: LightboxConfig, ui: UI, images: Element[]) {
        if ('counter' in ui.elements) ui.elements.counter.total = images.length;

        this.ui = ui;
        this.images = images;
        this.config = config;
    }

    public static build(config?: LightboxConfig) {
        config = { ...defaults, ...config };

        const images = Array.from(
            document.querySelectorAll(
                `.${config.targetClass || defaults.targetClass}`
            )
        );

        const ui = new UI(config);

        return new Gullview(config, ui, images);
    }

    private get currentImage(): ImageObject {
        return this._currentImage;
    }

    private set currentImage(value: ImageObject) {
        if ('counter' in this.ui.elements) {
            this.ui.elements.counter.count = value.index + 1;
        }

        const jumping =
            (this.currentImage?.index === this.images.length - 1 &&
                value.index === 0) ||
            (this.currentImage?.index === 0 &&
                value.index === this.images.length - 1);

        let direction: 'next' | 'prev' =
            value.index > this.currentImage?.index ? 'next' : 'prev';

        if (jumping) direction = direction === 'next' ? 'prev' : 'next';

        this.ui.updateSource(value, !this.ui.isOpen, direction);
        this._currentImage = value;
    }

    private get images(): ImageObject[] {
        return this._images;
    }

    private set images(value: unknown[]) {
        const imageObjects = value.map((parent, idx) => {
            if (!(parent instanceof HTMLElement))
                throw new Error(
                    'Items targeted by gullview must be HTMLImageElements'
                );

            const elem = parent.querySelector('img');

            if (!(elem instanceof HTMLImageElement))
                throw new Error(
                    'Items targeted by gullview must contain an img element.'
                );

            const [src, alt] = [
                elem.getAttribute('src'),
                elem.getAttribute('alt'),
            ];

            if (!src)
                throw new Error('Images must have a src and alt attribute.');

            if (!alt) throw new Error('Images must have an alt attribute.');

            return {
                parent,
                index: idx,
                image: {
                    src,
                    alt,
                    elem,
                },
            };
        });

        this._images = imageObjects;
    }

    private handleOpen(e: MouseEvent, element: ImageObject) {
        this.currentImage = element;
        this.ui.open(e);
    }

    private handleNext() {
        if (!this.currentImage) return;

        const next =
            this.currentImage.index !== this.images.length - 1
                ? this.images[this.currentImage.index + 1]
                : this.images[0];

        this.currentImage = next;
    }

    private handlePrev() {
        if (!this.currentImage) return;

        const prev =
            this.currentImage.index !== 0
                ? this.images[this.currentImage.index - 1]
                : this.images[this.images.length - 1];

        this.currentImage = prev;
    }

    public init = () => {
        this.images.forEach((element) => {
            element.parent.addEventListener('click', (e) =>
                this.handleOpen(e, element)
            );
        });

        const arrows = [this.ui.elements.next, this.ui.elements.prev];

        arrows.forEach(({ direction, element }) => {
            if (direction === 'next')
                return element.addEventListener('click', (e) => {
                    e.stopPropagation();
                    this.handleNext();
                });

            if (direction === 'prev')
                return element.addEventListener('click', (e) => {
                    e.stopPropagation();
                    this.handlePrev();
                });
        });
    };
}
