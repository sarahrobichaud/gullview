import Lightbox from './Lightbox.ts';

try {
	const lightbox = new Lightbox({
		targetClass: 'lightbox__src',
	});
	lightbox.init();
} catch (e) {
	console.error(`Error: ${e.message}`);
}
