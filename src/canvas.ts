import { pipe, projection } from './helpers';

export const createController = (
  draw: ([x, y]: [number, number]) => [number, number],
  interruptor: () => void,
) => {
  let isDrawing = false;

  return {
    onMouseDown: ({ clientX, clientY }: MouseEvent) => {
      isDrawing = true;
      draw([clientX, clientY]);
    },
    onMouseUp: () => {
      isDrawing = false;
      interruptor();
    },

    onMouseMove: ({ clientX, clientY }: MouseEvent) => {
      if (!isDrawing) return;
      draw([clientX, clientY]);
    },
  };
};

export const createBoundsSetter = ({
  main,
  mainContainer,
  minimap,
  scaleFactor,
}: {
  main: HTMLCanvasElement
  mainContainer: HTMLDivElement
  minimap: HTMLCanvasElement
  scaleFactor: number
}) => () => {
  main.width = mainContainer.offsetWidth;
  main.height = mainContainer.offsetHeight;

  minimap.width = main.width * scaleFactor;
  minimap.height = main.height * scaleFactor;
};

const createDrawer = (
  canvas: HTMLCanvasElement,
  scaleFactor = 1,
  adapter = (x: number, y: number) => [x, y],
) => {
  const context = canvas.getContext('2d');

  return ([rx, ry]: [number, number]): [number, number] => {
    if (!context) return [0, 0];

    const [x, y] = adapter(rx, ry);

    context.lineWidth = 4 * scaleFactor;
    context.lineCap = 'round';
    context.strokeStyle = 'navy';

    context.lineTo(x, y);
    context.stroke();
    context.beginPath();
    context.moveTo(x, y);

    return [x, y];
  };
};

export const setupDrawer = ({
  main,
  minimap,
  scaleFactor,
}: {
  main: HTMLCanvasElement
  minimap: HTMLCanvasElement
  scaleFactor: number
}) => {
  const offsetAdjuster = createOffsetAdjuster(main);
  const minimapProjector = createMinimapProjector(main, minimap);

  const drawMain = createDrawer(main, 1, offsetAdjuster);
  const drawMinimap = createDrawer(minimap, scaleFactor, minimapProjector);

  const draw = ([x, y]: [number, number]) => pipe(drawMain, drawMinimap)([x, y]);

  const interrupt = createInterruptor([main, minimap]);

  return { draw, interrupt };
};

function createInterruptor(canvases: HTMLCanvasElement | HTMLCanvasElement[]) {
  const contextes = canvases instanceof HTMLCanvasElement
    ? [canvases.getContext('2d')]
    : canvases.map(canvas => canvas.getContext('2d'));

  return () => {
    contextes.forEach(ctx => ctx?.beginPath());

    return false;
  };
}

function createMinimapProjector(main: HTMLCanvasElement, minimap: HTMLCanvasElement) {
  const mainRect = main.getBoundingClientRect();
  const minimapRect = minimap.getBoundingClientRect();

  return (x: number, y: number) => [
    projection([0, mainRect.width], [0, minimapRect.width], x),
    projection([0, mainRect.height], [0, minimapRect.height], y),
  ];
};

function createOffsetAdjuster(canvas: HTMLCanvasElement) {
  const canvasRect = canvas.getBoundingClientRect();
  return (x: number, y: number) => [x - canvasRect.left, y - canvasRect.top];
}
