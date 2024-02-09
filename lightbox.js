const lightbox = document.getElementsByClassName('lightbox')[0];
const imgs = Array.from(document.getElementsByClassName('img-card'));
const display = lightbox.querySelector('.lightbox__img');

const [prev, next] = document.querySelectorAll('.lightbox button');

const debugDisplay = document.querySelector('#debug');

function handleNext() {
	const current = imgs.find(
		(i) =>
			i.querySelector('img').getAttribute('src') ===
			display.getAttribute('src')
	);
	const next = imgs[imgs.indexOf(current) + 1];
	if (!next) return;
	display.setAttribute('src', next.querySelector('img').getAttribute('src'));
}

function handlePrev() {
	const current = imgs.find(
		(i) =>
			i.querySelector('img').getAttribute('src') ===
			display.getAttribute('src')
	);
	const prev = imgs[imgs.indexOf(current) - 1];
	if (!prev) return;
	display.setAttribute('src', prev.querySelector('img').getAttribute('src'));
}

prev.addEventListener('click', handlePrev);
next.addEventListener('click', handleNext);

function preventScroll(e) {
	if (e.ctrlKey) e.preventDefault(); //prevent zoom
}

imgs.forEach((img) => {
	img.addEventListener('click', ({ target }) => {
		document.body.addEventListener('wheel', preventScroll, {
			passive: false,
		});
		lightbox.classList.add('show');
		document.body.style.overflowY = 'hidden';
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

function offsetPos(clientX, clientY, bounds) {
	const offsetX = (clientX - bounds.left) / bounds.width;
	const offsetY = (clientY - bounds.top) / bounds.height;
	return { offsetX, offsetY };
}

// movement offset for zoom

function zoom({ offsetX, offsetY }, level = 3) {
	display.style.transformOrigin = `${offsetX * 100}% ${offsetY * 100}%`;
	display.classList.add('zoomed');
	prev.style.visibility = 'hidden';
	next.style.visibility = 'hidden';
	display.style.transform = `scale(${level})`;

	const bounds = display.getBoundingClientRect();

	window.addEventListener('mousemove', (e) => {
		const { clientX, clientY } = e;
		const offsets = offsetPos(clientX, clientY, bounds);
		display.style.transformOrigin = `${offsets.offsetX * 100}% ${
			offsets.offsetY * 100
		}%`;
	});
}
function unzoom() {
	display.classList.remove('zoomed');
	display.style.transform = '';
	prev.style.visibility = 'visible';
	next.style.visibility = 'visible';
}

display.addEventListener('click', ({ clientX, clientY, target }) => {
	const bounds = target.getBoundingClientRect();
	const offsets = offsetPos(clientX, clientY, bounds);
	if (display.style.transform === '') zoom(offsets);
	else unzoom();
});
lightbox.addEventListener('click', ({ clientX, clientY, target }) => {
	if (!target.classList.contains('lightbox')) return;
	unzoom();
	document.body.style.overflowY = 'visible';
	document.body.removeEventListener('wheel', preventScroll);

	// Exit if click is not on lightbox background
	const bounds = display.getBoundingClientRect();

	const logs = {
		bounds,
		clientX,
		clientY,
	};
	debugDisplay.innerHTML = JSON.stringify(logs, null, 2);
	lightbox.classList.remove('show');
});
