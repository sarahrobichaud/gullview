export const offsetPos = (clientX, clientY, bounds) => {
	const offsetX = (clientX - bounds.left) / bounds.width;
	const offsetY = (clientY - bounds.top) / bounds.height;
	return { offsetX, offsetY };
};
