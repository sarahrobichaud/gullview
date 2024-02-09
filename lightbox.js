const lightbox = document.getElementsByClassName('lightbox')[0];
const imgs = Array.from(document.getElementsByClassName('img-card'));
const display = lightbox.querySelector('.lightbox__img');

const [prev, next] = document.querySelectorAll('.lightbox button');

const debugDisplay = document.querySelector('#debug');

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

		const src =
			target.getAttribute('src') ||
			target.querySelector('img').getAttribute('src');
		display.setAttribute('src', src);
	});
});

function offsetClick(clientX, clientY, bounds) {
	const offsetX = (clientX - bounds.left) / bounds.width;
	const offsetY = (clientY - bounds.top) / bounds.height;
	return { offsetX, offsetY };
}

function zoom({ offsetX, offsetY }, level = 3) {
	display.style.transformOrigin = `${offsetX * 100}% ${offsetY * 100}%`;
	display.classList.add('zoomed');
	display.style.transform = `scale(${level})`;
}
function unzoom() {
	display.classList.remove('zoomed');
	display.style.transform = '';
}

display.addEventListener('click', ({ clientX, clientY, target }) => {
	const bounds = target.getBoundingClientRect();
	const offsets = offsetClick(clientX, clientY, bounds);
	if (display.style.transform === '') zoom(offsets);
	else unzoom();
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
