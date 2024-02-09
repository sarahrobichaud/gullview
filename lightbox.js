const lightbox = document.getElementsByClassName('lightbox')[0];
const imgs = Array.from(document.getElementsByClassName('img-card'));
const display = lightbox.querySelector('.lightbox__img');

const [prev, next] = document.querySelectorAll('.lightbox button');

const debugDisplay = document.querySelector('#debug');

function debug(obj) {}

prev.addEventListener('click', () => {
	console.log('click');
});

imgs.forEach((img) => {
	img.addEventListener('click', ({ target }) => {
		lightbox.classList.add('show');
		const img = document.querySelector('img');

		const current = imgs.find(
			(i) =>
				i.querySelector('img').getAttribute('src') ===
				img.getAttribute('src')
		);

		console.log(current);
		const src =
			target.getAttribute('src') ||
			target.querySelector('img').getAttribute('src');
		display.setAttribute('src', src);
	});
});

lightbox.addEventListener('click', ({ clientX, clientY, target }) => {
	// Exit if click is not on lightbox background
	if (!target.classList.contains('lightbox')) return;
	const bounds = display.getBoundingClientRect();

	const logs = {
		bounds,
		clientX,
		clientY,
	};
	debugDisplay.innerHTML = JSON.stringify(logs, null, 2);
	lightbox.classList.remove('show');
});
