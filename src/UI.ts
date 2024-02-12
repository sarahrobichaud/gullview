import AnimationHandler, { AnimationConfig } from './Animation';
import { ImageObject, LightboxConfig } from './Lightbox';

interface UIElement {
	prev: HTMLButtonElement;
	next: HTMLButtonElement;
	counter: HTMLSpanElement;
}

export type UIConfig = {
	animation: AnimationConfig;
	zoom: {
		level: number;
	};
	counter: {
		show: boolean;
	};
};

const defaultZoom = {
	level: 1.5,
} satisfies UIConfig['zoom'];

const defaultCounter = {
	show: false,
} satisfies UIConfig['counter'];

export class UI {
	private animationHandler: AnimationHandler;

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
		this.handleCursorOffset = this.handleCursorOffset.bind(this);
		this.totalImages = totalImages;

		const display = document.createElement('img');
		display.classList.add('lightbox__display');
		display.setAttribute('alt', 'lightbox display');

		this.backDisplay = display;

		this.animationHandler = new AnimationHandler(display, animationConfig);

		const uiElements = {
			prev: this.createArrow('prev'),
			next: this.createArrow('next'),
			counter: this.createCounter(),
		};

		this.config.zoom = { ...defaultZoom, ...zoomConfig };
		this.config.counter = { ...defaultCounter, ...counterConfig };

		this.background.appendChild(display);

		Object.entries(uiElements).forEach(([key, elem]) => {
			if (!this.config.counter.show && key === 'counter') return;
			this.background.appendChild(elem);
		});

		this.background.addEventListener('click', this.close.bind(this));

		this.display.addEventListener('click', this.handleZoom.bind(this));
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
	private offsetPos(clientX, clientY, bounds) {
		const offsetX = (clientX - bounds.left) / bounds.width;
		const offsetY = (clientY - bounds.top) / bounds.height;
		return { offsetX, offsetY };
	}

	private handleZoom({ clientX, clientY, target }) {
		const bounds = target.getBoundingClientRect();
		const offsets = this.offsetPos(clientX, clientY, bounds);
		if (this.display.style.transform === '') {
			this.zoom(offsets);
		} else {
			this.unzoom();
		}
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

	private preventNativeZoom(e: WheelEvent) {
		if (e.ctrlKey) e.preventDefault(); //prevent zoom
	}
	private allowZoom() {
		document.body.removeEventListener('wheel', this.preventNativeZoom);
	}
	private blockZoom() {
		const options = { passive: false };
		document.body.addEventListener(
			'wheel',
			this.preventNativeZoom,
			options
		);
	}
	private unzoom() {
		this.display.classList.remove('zoomed');
		this.display.style.transform = '';
		this.elements.prev.style.visibility = 'visible';
		this.elements.next.style.visibility = 'visible';
		window.removeEventListener('mousemove', this.handleCursorOffset);
	}
	private zoom({ offsetX, offsetY }, level = this.config.zoom.level) {
		this.display.style.transformOrigin = `${offsetX * 100}% ${
			offsetY * 100
		}%`;
		this.display.classList.add('zoomed');
		this.elements.prev.style.visibility = 'hidden';
		this.elements.next.style.visibility = 'hidden';
		this.display.style.transform = `scale(${level})`;

		window.addEventListener('mousemove', this.handleCursorOffset);
	}

	private handleCursorOffset(e) {
		const { clientX, clientY } = e;
		const bounds = this.display.getBoundingClientRect();
		const offsets = this.offsetPos(clientX, clientY, bounds);
		this.display.style.transformOrigin = `${offsets.offsetX * 100}% ${
			offsets.offsetY * 100
		}%`;
	}

	private allowScroll() {
		document.body.style.overflowY = 'visible';
	}

	private blockScroll() {
		document.body.style.overflowY = 'hidden';
	}

	public open = ({ target }: MouseEvent, element: ImageObject) => {
		if (!(target instanceof HTMLImageElement)) return;

		this.blockZoom();
		this.blockScroll();
		this.background.classList.add('show');
		this.isOpen = true;
	};

	public close = (e: MouseEvent) => {
		if (!(e.target instanceof HTMLDivElement)) return;

		this.unzoom();
		this.allowZoom();
		this.allowScroll();
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
