import { DataStore } from '../DataStore';
import { Base } from './Base';

class MovableElement extends Base {
  private dataStore: DataStore;
  private background: HTMLImageElement;
  constructor (dataStore: DataStore, background: HTMLImageElement) {
    super();
    this.dataStore = dataStore;
    this.background = background;
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
      this.dataStore.moveImage(this.id, this.image.offsetLeft, this.image.offsetTop);
    });
    document.addEventListener('mousemove', (event: MouseEvent) => {
      if (!moving) {
        return;
      }

      const viewportOffset = this.background.getBoundingClientRect();

      const left = event.clientX - viewportOffset.left;
      const top = event.clientY - viewportOffset.top;

      this.image.style.left = `${left - pointerX}px`;
      this.image.style.top = `${top - pointerY}px`;
    });
  }

  public delete = () => {
    this.dataStore.deleteImage(this.id);
    const dom = document.querySelector(`[data-id='${this.id}']`);
    dom?.remove();
  }
}

export const spawnMovableElement = (dataStore: DataStore, background: HTMLImageElement) => new MovableElement(dataStore, background);
