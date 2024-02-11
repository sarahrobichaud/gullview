import { UI } from './UI';

export type ImageObject = {
	parent: HTMLElement;
	index: number;
	image: {
		alt: string;
		src: string;
		elem: HTMLImageElement;
	};
};

export type LightboxConfig = {
	targetClass: string;
	zoom: {
		level: number;
	};
	animation: {
		animate: boolean;
		duration: number;
		next?: string;
		prev?: string;
	};
};

export default class Lightbox {
	private backImages: Array<ImageObject>;
	private backCurrentImage: ImageObject;
	private readonly ui: UI;

	readonly backConfig: LightboxConfig;

	constructor(config: LightboxConfig) {
		this.ui = new UI(config.zoom, config.animation);
		this.images = Array.from(
			document.querySelectorAll(`.${config.targetClass}`)
		);
		this.backConfig = config;
	}

	get config(): LightboxConfig {
		return this.backConfig;
	}

	get currentImage(): ImageObject {
		return this.backCurrentImage;
	}

	set currentImage(value: ImageObject) {
		const jumping =
			(this.currentImage?.index === this.images.length - 1 &&
				value.index === 0) ||
			(this.currentImage?.index === 0 &&
				value.index === this.images.length - 1);

		let direction: 'next' | 'prev' =
			value.index > this.currentImage?.index ? 'next' : 'prev';

		if (jumping) direction = direction === 'next' ? 'prev' : 'next';

		this.ui.updateSource(value.image, this.ui.isOpen, direction);
		this.backCurrentImage = value;
	}

	get images(): ImageObject[] {
		return this.backImages;
	}

	set images(value: unknown[]) {
		const imageObjects = value.map((parent, idx) => {
			if (!(parent instanceof HTMLElement))
				throw new Error(
					'Items targeted by lightbox must be HTMLImageElements'
				);

			const elem = parent.querySelector('img');

			if (!(elem instanceof HTMLImageElement))
				throw new Error(
					'Items targeted by lightbox must contain an img element.'
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

		this.backImages = imageObjects;
	}

	private handleOpen(e: MouseEvent, element: ImageObject) {
		this.currentImage = element;
		this.ui.open(e, element);
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

	init = () => {
		this.images.forEach((element) => {
			element.parent.addEventListener('click', (e) =>
				this.handleOpen(e, element)
			);
		});

		Object.values(this.ui.buttons).forEach((arrow) => {
			arrow.addEventListener('click', (e) => {
				e.stopPropagation();
				if (arrow.classList.contains('prev')) this.handlePrev();
				if (arrow.classList.contains('next')) this.handleNext();
			});
		});
	};
}
