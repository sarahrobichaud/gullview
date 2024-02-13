import AnimationHandler, { AnimationConfig } from './Animation';
import { ImageObject, LightboxConfig } from './Lightbox';
import ZoomHandler, { ZoomConfig } from './Zoom';
import { allowScroll, blockScroll } from './utils/scroll';

interface UIElement {
	prev: HTMLButtonElement;
	next: HTMLButtonElement;
	counter: HTMLSpanElement;
}

export type UIConfig = {
	animation: AnimationConfig;
	zoom: ZoomConfig;
	counter: {
		show: boolean;
	};
};

const defaultCounter = {
	show: false,
} satisfies UIConfig['counter'];

export class UI {
	private animationHandler: AnimationHandler;
	private zoomHandler: ZoomHandler;

	private backBackground: HTMLDivElement;
	private backDisplay: HTMLImageElement;
	private backElements = {} as UIElement;

	private backIsOpen: boolean = false;

	private config = {} as UIConfig;
	private totalImages: number;

	constructor(
		zoomConfig: LightboxConfig['zoom'], // Zoom level and
		animationConfig: LightboxConfig['animation'],
		counterConfig: LightboxConfig['counter'],
		totalImages: number
	) {
		this.background = document.querySelector('.lightbox');
		this.totalImages = totalImages;

		const display = document.createElement('img');
		display.classList.add('lightbox__display');
		display.setAttribute('alt', 'lightbox display');

		this.backDisplay = display;

		this.zoomHandler = new ZoomHandler(zoomConfig, this);
		this.animationHandler = new AnimationHandler(display, animationConfig);

		const uiElements = {
			prev: this.createArrow('prev'),
			next: this.createArrow('next'),
			counter: this.createCounter(),
		};

		this.config.counter = { ...defaultCounter, ...counterConfig };

		this.background.appendChild(display);

		Object.entries(uiElements).forEach(([key, elem]) => {
			if (!this.config.counter.show && key === 'counter') return;
			this.background.appendChild(elem);
		});

		this.background.addEventListener('click', this.close.bind(this));

		this.display.addEventListener('click', this.zoomHandler.listener);
	}

	get display() {
		return this.backDisplay;
	}

	get elements() {
		return this.backElements;
	}

	get isOpen() {
		return this.backIsOpen;
	}

	private set isOpen(value: boolean) {
		this.backIsOpen = value;
	}

	get background(): HTMLDivElement {
		return this.backBackground;
	}

	set background(value: unknown) {
		if (!value)
			throw new Error('No elements with a class of "lightbox" found');

		if (!(value instanceof HTMLDivElement))
			throw new Error('Lightbox must be a div');

		this.backBackground = value;
	}

	private createCounter() {
		const counter = document.createElement('span');
		const count = document.createTextNode('22/43');

		counter.classList.add('lightbox__counter');
		counter.appendChild(count);

		this.elements.counter = counter;

		return counter;
	}

	private createArrow(dir: 'prev' | 'next'): HTMLButtonElement {
		const arrowContainer = document.createElement('button');

		const leftArrow =
			'<svg xlmns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-arrow-left"><path d="m12 19-7-7 7-7"/><path d="M19 12H5"/></svg>';
		const rightArrow =
			'<svg xlmns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-arrow-right"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>';

		arrowContainer.innerHTML = dir === 'prev' ? leftArrow : rightArrow;

		arrowContainer.classList.add('lightbox__arrow', dir);
		this.elements[dir] = arrowContainer;
		this.background.appendChild(arrowContainer);
		return arrowContainer;
	}

	public open = ({ target }: MouseEvent, element: ImageObject) => {
		if (!(target instanceof HTMLImageElement)) return;

		blockScroll();
		if (this.zoomHandler.config.blockNative) this.zoomHandler.blockNative();
		this.background.classList.add('show');
		this.isOpen = true;
	};

	public close = (e: MouseEvent) => {
		if (!(e.target instanceof HTMLDivElement)) return;

		this.zoomHandler.unzoom();
		this.zoomHandler.allowNative();
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
		this.animationHandler.clearQueue();

		this.elements.counter.textContent = `${element.index + 1}/${
			this.totalImages
		}`;

		if (skipAnimation || !this.animationHandler.config.enabled) {
			this.display.setAttribute('src', element.image.src);
			this.display.setAttribute('alt', element.image.alt);
		} else {
			this.animationHandler.swapTo(element, direction);
		}
	};
}
