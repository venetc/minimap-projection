import { createBoundsSetter, createController, setupDrawer } from './canvas';
import { getElements } from './helpers';

window.addEventListener('load', init);

function init() {
  const { mainContainer, main, minimap } = getElements();
  const scaleFactor = 0.25;

  const setBounds = createBoundsSetter({ main, mainContainer, minimap, scaleFactor });
  setBounds();

  window.addEventListener('resize', setBounds);

  const { draw, interrupt } = setupDrawer({ main, minimap, scaleFactor });

  const { onMouseDown, onMouseMove, onMouseUp } = createController(draw, interrupt);

  main.addEventListener('mousedown', onMouseDown);
  main.addEventListener('mouseup', onMouseUp);
  main.addEventListener('mousemove', onMouseMove);
}
