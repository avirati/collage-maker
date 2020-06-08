import { BaseCanvas } from './Canvas';
import { moveImage } from '../DataStore';

class MovableElements extends BaseCanvas {
  constructor () {
    super();
    this.addDragNDropListeners();
  }

  private addDragNDropListeners = () => {
    let moving = false;
    let pointerX = 0;
    let pointerY = 0;
    this.canvas.addEventListener('mousedown', (event: MouseEvent) => {
      moving = true;
      pointerX = event.offsetX;
      pointerY = event.offsetY;
    });
    this.canvas.addEventListener('mouseup', () => {
      moving = false;
      moveImage(this.id, this.canvas.offsetLeft, this.canvas.offsetTop);
    });
    document.addEventListener('mousemove', (event: MouseEvent) => {
      if (!moving) {
        return;
      }

      const left = event.clientX;
      const top = event.clientY;

      this.canvas.style.left = `${left - pointerX}px`;
      this.canvas.style.top = `${top - pointerY}px`;
    });
  }
}

export const spawnMovableElement = () => new MovableElements();
