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

type LightboxConfig = {
	targetClass: string;
};

const ui = new UI();

export class Lightbox {
	private backImages: Array<ImageObject>;
	private backCurrentImage: ImageObject;

	readonly backConfig: LightboxConfig;

	constructor(config: LightboxConfig) {
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
		ui.updateSource(value.image);
		this.backCurrentImage = value;
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

	get images(): ImageObject[] {
		return this.backImages;
	}

	private handleOpen(e: MouseEvent, element: ImageObject) {
		ui.open(e, element);
		this.currentImage = element;
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

		Object.values(ui.arrows).forEach((arrow) => {
			arrow.addEventListener('click', (e) => {
				e.stopPropagation();
				if (arrow.classList.contains('prev')) this.handlePrev();
				if (arrow.classList.contains('next')) this.handleNext();
			});
		});
	};
}
