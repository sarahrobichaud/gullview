import Lightbox from './Lightbox.ts';

try {
	const lightbox = new Lightbox({
		targetClass: 'lightbox__src',
		animation: {
			animate: true,
			duration: 600,
			prev: 'custom_prev',
			next: 'custom_next',
		},
	});
	lightbox.init();
} catch (e) {
	console.error(`Error: ${e.message}`);
}
