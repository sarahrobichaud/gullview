import { UI } from './UI';

export class Lightbox {
	private images;
	private UI;

	constructor() {
		this.UI = new UI();
		console.log('Lightbox constructor');
	}

	print() {
		console.log('Hello World');
		console.log(this.UI.background);
		console.log(this.UI);
	}
}
