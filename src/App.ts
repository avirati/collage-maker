import { background } from './components/Background';
import { getMenu } from './components/ContextMenu';
import { spawnMovableElement } from './components/MovableElements';

const menu = getMenu('menuContainer', 'menuItemContainer');

const addDragNDropListeners = (parentContainer: HTMLDivElement) => {
  const FileSelectHandler = (event: DragEvent) => {
    event.stopPropagation();
    event.preventDefault();
    const file: File = event.dataTransfer!.files[0];

    const reader = new FileReader();

    reader.onload = () => {
      const movableElement = spawnMovableElement();
      const image = document.createElement('img');
      image.src = reader.result as string;
      image.onload = () => {
        movableElement.canvas.width = image.width;
        movableElement.canvas.height = image.height;
        movableElement.context.drawImage(image, 0, 0);

        // Position canvas in center
        const backgroundWidth = background.getDom().offsetWidth;
        const backgroundHeight = background.getDom().offsetHeight;
        movableElement.canvas.style.left = `${backgroundWidth / 2 - image.width / 2}px`;
        movableElement.canvas.style.top = `${backgroundHeight / 2 - image.height / 2}px`;
      };
      parentContainer.appendChild(movableElement.canvas);
    };

    reader.readAsDataURL(file);
  };
  const FileDragHover = (event: DragEvent) => {
    event.stopPropagation();
    event.preventDefault();
  };

  parentContainer.addEventListener('dragover', FileDragHover, false);
  parentContainer.addEventListener('dragleave', FileDragHover, false);
  parentContainer.addEventListener('drop', FileSelectHandler, false);
};

export const addContextMenuHandler = (parentContainer: HTMLDivElement) => {
  menu.renderMenu([
    {
      label: 'Insert Icon with Text',
    },
    {
      label: 'Export Collage',
    },
    {
      label: 'Save',
    },
    {
      label: 'Load Saved Collage',
    },
  ]);
  parentContainer.appendChild(menu.dom);
  parentContainer.addEventListener('contextmenu', (event: MouseEvent) => {
    event.preventDefault();
    menu.positionMenu(event.clientX, event.clientY);
  });
};

export const renderApplication = (parentContainer: HTMLDivElement, applicationWidth: number, applicationHeight: number) => {
  parentContainer.style.width = `${applicationWidth}px`;
  parentContainer.style.height = `${applicationHeight}px`;
  addDragNDropListeners(parentContainer);
  addContextMenuHandler(parentContainer);

  background.setSize(applicationWidth, applicationHeight);

  parentContainer.appendChild(background.getDom());
};
