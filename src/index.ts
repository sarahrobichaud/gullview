import { Lightbox } from './Lightbox.ts';
import { UI } from './UI.ts';

try {
	new Lightbox({
		targetClass: 'lightbox__src',
	}).init();
} catch (e) {
	console.error(`Error: ${e.message}`);
}
