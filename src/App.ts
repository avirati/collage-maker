import { background } from './components/Background';
import { getMenu } from './components/ContextMenu';
import { IconWithText } from './components/IconWithText';
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

const addContextMenuHandler = (parentContainer: HTMLDivElement) => {
  menu.renderMenu([
    {
      label: 'Insert Icon with Text',
      menuAction: () => insertIconWithText(parentContainer),
    },
    {
      label: 'Export Collage',
      menuAction: () => null,
    },
    {
      label: 'Save',
      menuAction: () => null,
    },
    {
      label: 'Load Saved Collage',
      menuAction: () => null,
    },
  ]);
  parentContainer.appendChild(menu.dom);
  parentContainer.addEventListener('contextmenu', (event: MouseEvent) => {
    event.preventDefault();
    menu.positionMenu(event.clientX, event.clientY);
  });
};

const insertIconWithText = (parentContainer: HTMLDivElement) => {
  const iconUrl: string = window.prompt('Please enter icon URL')!;
  const iconTitle: string = window.prompt('Please enter a Title')!;
  const iconDescription: string = window.prompt(`Please enter a Description for ${iconTitle}`)!;

  const iconWithText = new IconWithText(iconUrl, iconTitle, iconDescription, 'iconWithText');
  const backgroundWidth = background.getDom().offsetWidth;
  const backgroundHeight = background.getDom().offsetHeight;
  iconWithText.dom.style.left = `${backgroundWidth / 2 - iconWithText.dom.offsetWidth / 2}px`;
  iconWithText.dom.style.top = `${backgroundHeight / 2 - iconWithText.dom.offsetHeight / 2}px`;

  parentContainer.appendChild(iconWithText.dom);
};

export const renderApplication = (parentContainer: HTMLDivElement, applicationWidth: number, applicationHeight: number, applicationBackgroundImage: string) => {
  parentContainer.innerHTML = '';
  parentContainer.style.width = `${applicationWidth}px`;
  parentContainer.style.height = `${applicationHeight}px`;
  addDragNDropListeners(parentContainer);
  addContextMenuHandler(parentContainer);

  background.setSize(applicationWidth, applicationHeight);
  background.setBackground(applicationBackgroundImage);

  parentContainer.appendChild(background.getDom());
};
