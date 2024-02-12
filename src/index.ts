import Lightbox from './Lightbox.ts';

try {
	const lightbox = new Lightbox({
		targetClass: 'lightbox__src',
		zoom: {
			level: 3,
		},
		animation: {
			enabled: true,
			duration: 500,
			next: 'custom_next',
		},
		counter: {
			show: true,
		},
	});
	lightbox.init();
} catch (e) {
	console.error(`Error: ${e.message}`);
}
