import Lightbox from './Lightbox.ts';

try {
	const lightbox = new Lightbox({
		targetClass: 'lightbox__src',
		zoom: {
			level: 3,
		},
		animation: {
			animate: true,
			duration: 600,
		},
	});
	lightbox.init();
} catch (e) {
	console.error(`Error: ${e.message}`);
}
