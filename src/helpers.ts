const isCanvas = (element: Element): element is HTMLCanvasElement => element instanceof HTMLCanvasElement;
const isContainer = (element: Element): element is HTMLDivElement => element instanceof HTMLDivElement;

export const projection = (
  [x1, x2]: [number, number],
  [y1, y2]: [number, number],
  z: number,
) => (z - x1) / (x2 - x1) * (y2 - y1) + y1;

export const getElements = () => {
  const [
    mainContainer,
    main,
    minimapContainer,
    minimap,
  ] = document.querySelectorAll('#canvas-main-container, #canvas-main, #canvas-minimap-container, #canvas-minimap');

  if (!isContainer(mainContainer)) throw new Error('mainContainer is not a container');
  if (!isCanvas(main)) throw new Error('main is not a canvas');
  if (!isContainer(minimapContainer)) throw new Error('minimapContainer is not a container');
  if (!isCanvas(minimap)) throw new Error('minimap is not a canvas');

  return { mainContainer, main, minimapContainer, minimap };
};

export const pipe = <A, B, C>(
  f: (a: A) => B,
  g: (b: B) => C,
) => {
  return (a: A): C => g(f(a));
};
