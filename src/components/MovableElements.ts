import { deleteImage, moveImage } from '../DataStore';
import { BaseCanvas } from './Canvas';

class MovableElement extends BaseCanvas {
  constructor () {
    super();
    this.addDragNDropListeners();
  }

  private addDragNDropListeners = () => {
    let moving = false;
    let pointerX = 0;
    let pointerY = 0;
    this.image.addEventListener('mousedown', (event: MouseEvent) => {
      if (event.which === 1) {
        moving = true;
        pointerX = event.offsetX;
        pointerY = event.offsetY;
      }
    });
    this.image.addEventListener('mouseup', () => {
      moving = false;
      moveImage(this.id, this.image.offsetLeft, this.image.offsetTop);
    });
    document.addEventListener('mousemove', (event: MouseEvent) => {
      if (!moving) {
        return;
      }

      const left = event.clientX;
      const top = event.clientY;

      this.image.style.left = `${left - pointerX}px`;
      this.image.style.top = `${top - pointerY}px`;
    });
  }

  public delete = () => {
    deleteImage(this.id);
    const dom = document.querySelector(`[data-id='${this.id}']`);
    dom?.remove();
  }
}

export const spawnMovableElement = () => new MovableElement();
