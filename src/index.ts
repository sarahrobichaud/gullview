import { Lightbox } from './Lightbox.ts';
import { UI } from './UI.ts';

try {
	const lightbox = new Lightbox();
	lightbox.print();
} catch (e) {
	console.error(`Error: ${e.message}`);
}
