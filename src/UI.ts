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
	}

	private createArrow(dir: 'prev' | 'next'): HTMLButtonElement {
		const arrow = document.createElement('button');
		arrow.classList.add('arrow', dir);
		arrow.textContent = dir;
		this.backArrows[dir] = arrow;
		this.backBackground.appendChild(arrow);
		return arrow;
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

	get display() {
		return this.backDisplay;
	}

	get arrows() {
		return this.backArrows;
	}
}
