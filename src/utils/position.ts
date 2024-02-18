export const offsetPos = (
  clientX: number,
  clientY: number,
  bounds: DOMRect
) => {
  const offsetX = (clientX - bounds.left) / bounds.width;
  const offsetY = (clientY - bounds.top) / bounds.height;
  return { offsetX, offsetY };
};
