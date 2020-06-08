import { ICON_SIZE } from '../globalConstants';

export class IconWithText {
  public dom: HTMLDivElement = document.createElement('div');
  constructor (url: string, title: string, description: string, containerClassName: string) {
    this.dom.className = containerClassName;
    this.loadIcon(url);
    this.loadText(title, 'iconTitle');
    this.loadText(description, 'iconDescription');

    this.addDragNDropListeners();
  }

  private loadIcon = (url: string) => {
    const image = document.createElement('img');
    image.src = url;
    image.width = ICON_SIZE;
    this.dom.appendChild(image);
  }

  private loadText = (content: string, className: string) => {
    const div = document.createElement('div');
    div.className = className;
    div.innerText = content;
    this.dom.appendChild(div);
  }

  private addDragNDropListeners = () => {
    let moving = false;
    let pointerX = 0;
    let pointerY = 0;
    this.dom.addEventListener('mousedown', (event: MouseEvent) => {
      moving = true;
      pointerX = event.offsetX;
      pointerY = event.offsetY;
    });
    this.dom.addEventListener('mouseup', () => {
      moving = false;
      pointerX = 0;
      pointerY = 0;
    });
    document.addEventListener('mousemove', (event: MouseEvent) => {
      if (!moving) {
        return;
      }

      const left = event.clientX;
      const top = event.clientY;

      this.dom.style.left = `${left - pointerX}px`;
      this.dom.style.top = `${top - pointerY}px`;
    });
  }
}
