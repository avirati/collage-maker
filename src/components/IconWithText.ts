import { deleteIcon, moveIconWithText } from '../DataStore';
import { ICON_SIZE } from '../globalConstants';
import { menu } from './ContextMenu';

export class IconWithText {
  public dom: HTMLDivElement = document.createElement('div');
  public id: string;
  constructor (url: string, title: string, description: string, containerClassName: string, id: string) {
    this.id = id;
    this.dom.setAttribute('data-id', id);
    this.dom.className = containerClassName;
    this.loadIcon(url);
    this.loadText(title, 'iconTitle');
    this.loadText(description, 'iconDescription');

    this.addDragNDropListeners();
    this.addContextMenuHandler();
  }

  private addContextMenuHandler = () => {
    this.dom.addEventListener('contextmenu', (event: MouseEvent) => {
      event.preventDefault();
      event.stopPropagation();

      menu.renderMenu([{
        label: 'Delete Element',
        menuAction: () => this.delete(),
      }]);

      menu.positionMenu(event.clientX, event.clientY);
    });
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
      // Left click
      if (event.which === 1) {
        moving = true;
        pointerX = event.offsetX;
        pointerY = event.offsetY;
      }
    });
    this.dom.addEventListener('mouseup', () => {
      moving = false;
      pointerX = 0;
      pointerY = 0;

      moveIconWithText(this.id, this.dom.offsetLeft, this.dom.offsetTop);
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

  public delete = () => {
    deleteIcon(this.id);
    const dom = document.querySelector(`[data-id='${this.id}']`);
    dom?.remove();
  }
}
