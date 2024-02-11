import { ImageObject } from './Lightbox';

interface Arrows {
	prev: HTMLButtonElement;
	next: HTMLButtonElement;
}

export class UI {
	private backBackground: HTMLDivElement;
	private backDisplay: HTMLImageElement;
	private backArrows = {} as Arrows;

	constructor() {
		this.background = document.querySelector('.lightbox');

		const display = document.createElement('img');
		display.classList.add('lightbox__display');
		display.setAttribute('alt', 'lightbox display');

		this.backDisplay = display;

		const { prev, next } = {
			prev: this.createArrow('prev'),
			next: this.createArrow('next'),
		};

		this.background.appendChild(prev);
		this.background.appendChild(display);
		this.background.appendChild(next);

		this.background.addEventListener('click', this.close.bind(this));

		this.display.addEventListener('click', this.handleZoom.bind(this));
	}

	get display() {
		return this.backDisplay;
	}

	get arrows() {
		return this.backArrows;
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
	private createArrow(dir: 'prev' | 'next'): HTMLButtonElement {
		const arrowContainer = document.createElement('button');

		const leftArrow =
			'<svg xlmns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-arrow-left"><path d="m12 19-7-7 7-7"/><path d="M19 12H5"/></svg>';
		const rightArrow =
			'<svg xlmns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-arrow-right"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>';

		arrowContainer.innerHTML = dir === 'prev' ? leftArrow : rightArrow;

		arrowContainer.classList.add('arrow', dir);
		this.arrows[dir] = arrowContainer;
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
		this.arrows.prev.style.visibility = 'visible';
		this.arrows.next.style.visibility = 'visible';
	}
	private zoom({ offsetX, offsetY }, level = 3) {
		this.display.style.transformOrigin = `${offsetX * 100}% ${
			offsetY * 100
		}%`;
		this.display.classList.add('zoomed');
		this.arrows.prev.style.visibility = 'hidden';
		this.arrows.next.style.visibility = 'hidden';
		this.display.style.transform = `scale(${level})`;

		const bounds = this.display.getBoundingClientRect();

		window.addEventListener('mousemove', (e) => {
			const { clientX, clientY } = e;
			const offsets = this.offsetPos(clientX, clientY, bounds);
			this.display.style.transformOrigin = `${offsets.offsetX * 100}% ${
				offsets.offsetY * 100
			}%`;
		});
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
		this.updateSource(element.image);
		this.background.classList.add('show');
	};

	public close = (e: MouseEvent) => {
		if (!(e.target instanceof HTMLDivElement)) return;

		this.unzoom();
		this.allowZoom();
		this.allowScroll();
		this.background.classList.remove('show');
	};

	public updateSource = (image: ImageObject['image']) => {
		this.display.setAttribute('src', image.src);
		this.display.setAttribute('alt', image.alt);
	};
}
