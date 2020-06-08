import { background } from './components/Background';
import { getMenu } from './components/ContextMenu';
import { IconWithText } from './components/IconWithText';
import { spawnMovableElement } from './components/MovableElements';
import { IApplicationData, IImage, IIconsWithText } from './interfaces';

const menu = getMenu('menuContainer', 'menuItemContainer');

const insertImage = (imageUrl: string, parentContainer: HTMLDivElement, imageData?: IImage) => {
  const movableElement = spawnMovableElement();
  const image = document.createElement('img');
  image.src = imageUrl;
  image.onload = () => {
    movableElement.canvas.width = image.width;
    movableElement.canvas.height = image.height;
    movableElement.context.drawImage(image, 0, 0);

    if (imageData) {
      // Position as per data
      movableElement.canvas.style.left = `${imageData.left}px`;
      movableElement.canvas.style.top = `${imageData.top}px`;
    } else {
      // Position canvas in center
      const backgroundWidth = background.getDom().offsetWidth;
      const backgroundHeight = background.getDom().offsetHeight;
      movableElement.canvas.style.left = `${backgroundWidth / 2 - image.width / 2}px`;
      movableElement.canvas.style.top = `${backgroundHeight / 2 - image.height / 2}px`;
    }
  };
  parentContainer.appendChild(movableElement.canvas);
}

const addDragNDropListeners = (parentContainer: HTMLDivElement) => {
  const FileSelectHandler = (event: DragEvent) => {
    event.stopPropagation();
    event.preventDefault();
    const file: File = event.dataTransfer!.files[0];

    const reader = new FileReader();

    reader.onload = () => {
      insertImage(reader.result as string, parentContainer);
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

const insertIconWithText = (parentContainer: HTMLDivElement, iconData?: IIconsWithText) => {
  let iconWithText: IconWithText;
  if (iconData) {
    iconWithText = new IconWithText(iconData.imageUrl, iconData.title, iconData.description, 'iconWithText');
    iconWithText.dom.style.left = `${iconData.left}px`;
    iconWithText.dom.style.top = `${iconData.top}px`;
  } else {
    const iconUrl: string = window.prompt('Please enter icon URL')!;
    const iconTitle: string = window.prompt('Please enter a Title')!;
    const iconDescription: string = window.prompt(`Please enter a Description for ${iconTitle}`)!;

    iconWithText = new IconWithText(iconUrl, iconTitle, iconDescription, 'iconWithText');
    const backgroundWidth = background.getDom().offsetWidth;
    const backgroundHeight = background.getDom().offsetHeight;
    iconWithText.dom.style.left = `${backgroundWidth / 2 - iconWithText.dom.offsetWidth / 2}px`;
    iconWithText.dom.style.top = `${backgroundHeight / 2 - iconWithText.dom.offsetHeight / 2}px`;
  }

  parentContainer.appendChild(iconWithText.dom);
};

export const renderApplication = (parentContainer: HTMLDivElement, data: IApplicationData) => {
  parentContainer.innerHTML = '';

  const {
    applicationHeight,
    applicationWidth,
    backgroundImageUrl,
  } = data;

  parentContainer.style.width = `${applicationWidth}px`;
  parentContainer.style.height = `${applicationHeight}px`;
  addDragNDropListeners(parentContainer);
  addContextMenuHandler(parentContainer);

  background.setSize(applicationWidth, applicationHeight);
  background.setBackground(backgroundImageUrl);

  parentContainer.appendChild(background.getDom());

  if (data.images && data.images.length > 0) {
    data.images.forEach((imageData) => {
      insertImage(imageData.imageUrl, parentContainer, imageData);
    });
  }

  if (data.iconsWithText && data.iconsWithText.length > 0) {
    data.iconsWithText.forEach((iconData) => {
      insertIconWithText(parentContainer, iconData);
    });
  }
};
