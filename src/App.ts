import { v4 as uuid } from 'uuid';

import {
  applicationHeightSelector,
  applicationWidthSelector,
  backgroundImageUrlSelector,
  getApplicationData,
  iconsWithTextSelector,
  imagesSelector,
  setApplicationData, setIconWithText, setImage } from './DataStore';
import { background } from './components/Background';
import { menu } from './components/ContextMenu';
import { IconWithText } from './components/IconWithText';
import { spawnMovableElement } from './components/MovableElements';
import { IApplicationData, IIconsWithText, IImage } from './interfaces';

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
      movableElement.setId(imageData.id);
    } else {
      // Position canvas in center
      const backgroundWidth = background.getDom().offsetWidth;
      const backgroundHeight = background.getDom().offsetHeight;
      const left = backgroundWidth / 2 - image.width / 2;
      const top = backgroundHeight / 2 - image.height / 2;
      movableElement.canvas.style.left = `${left}px`;
      movableElement.canvas.style.top = `${top}px`;

      const id = uuid();
      setImage({
        id,
        imageUrl,
        left,
        top,
      });
      movableElement.setId(id);
    }
  };
  parentContainer.appendChild(movableElement.canvas);
};

const addDragNDropListeners = (parentContainer: HTMLDivElement) => {
  const FileSelectHandler = (event: DragEvent) => {
    event.stopPropagation();
    event.preventDefault();
    const file: File = event.dataTransfer!.files[0];
    const isJSON = file.type === 'application/json';

    const reader = new FileReader();

    reader.onload = () => {
      if (isJSON) {
        const data: IApplicationData = JSON.parse(reader.result as string);
        importJSON(data, parentContainer);
      } else {
        insertImage(reader.result as string, parentContainer);
      }
    };

    if (isJSON) {
      reader.readAsText(file);
    } else {
      reader.readAsDataURL(file);
    }
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
  parentContainer.addEventListener('contextmenu', (event: MouseEvent) => {
    event.preventDefault();
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
        menuAction: () => exportJSONData(getApplicationData()),
      },
    ]);
    menu.positionMenu(event.clientX, event.clientY);
  });
};

const insertIconWithText = (parentContainer: HTMLDivElement, iconData?: IIconsWithText) => {
  let iconWithText: IconWithText;
  if (iconData) {
    iconWithText = new IconWithText(iconData.imageUrl, iconData.title, iconData.description, 'iconWithText', iconData.id);
    iconWithText.dom.style.left = `${iconData.left}px`;
    iconWithText.dom.style.top = `${iconData.top}px`;
  } else {
    const iconUrl: string = window.prompt('Please enter icon URL')!;
    const iconTitle: string = window.prompt('Please enter a Title')!;
    const iconDescription: string = window.prompt(`Please enter a Description for ${iconTitle}`)!;

    const id = uuid();
    iconWithText = new IconWithText(iconUrl, iconTitle, iconDescription, 'iconWithText', id);
    const backgroundWidth = background.getDom().offsetWidth;
    const backgroundHeight = background.getDom().offsetHeight;
    const left = backgroundWidth / 2 - iconWithText.dom.offsetWidth / 2;
    const top = backgroundHeight / 2 - iconWithText.dom.offsetHeight / 2;
    iconWithText.dom.style.left = `${left}px`;
    iconWithText.dom.style.top = `${top}px`;

    setIconWithText({
      description: iconDescription,
      id,
      imageUrl: iconUrl,
      left,
      title: iconTitle,
      top,
    });
  }

  parentContainer.appendChild(iconWithText.dom);
};

const exportJSONData = (applicationData: IApplicationData) => {
  const link = document.createElement('a');
  link.download = `${Date.now()}.json`;
  const blob = new Blob([JSON.stringify(applicationData)], { type: 'application/json' });
  link.href = window.URL.createObjectURL(blob);
  link.click();
};

const importJSON = (data: IApplicationData, parentContainer: HTMLDivElement) => {
  renderApplication(parentContainer, data);
};

export const renderApplication = (parentContainer: HTMLDivElement, data: IApplicationData) => {
  setApplicationData(data);
  parentContainer.innerHTML = '';

  const applicationHeight = applicationHeightSelector();
  const applicationWidth = applicationWidthSelector();
  const backgroundImageUrl = backgroundImageUrlSelector();
  const images = imagesSelector();
  const icons = iconsWithTextSelector();

  parentContainer.style.width = `${applicationWidth}px`;
  parentContainer.style.height = `${applicationHeight}px`;
  addDragNDropListeners(parentContainer);
  addContextMenuHandler(parentContainer);

  background.setSize(applicationWidth, applicationHeight);
  background.setBackground(backgroundImageUrl);

  parentContainer.appendChild(background.getDom());

  for (const key in images) {
    if (images[key]) {
      const imageData = images[key];
      insertImage(imageData.imageUrl, parentContainer, imageData);
    }
  }

  for (const key in icons) {
    if (icons[key]) {
      const iconData = icons[key];
      insertIconWithText(parentContainer, iconData);
    }
  }
};
