import * as html2canvas from 'html2canvas';
import { v4 as uuid } from 'uuid';

import { DataStore } from './DataStore';
import { Background } from './components/Background';
import { menu } from './components/ContextMenu';
import { IconWithText } from './components/IconWithText';
import { spawnMovableElement } from './components/MovableElements';
import { IApplicationData, IIconsWithText, IImage } from './interfaces';

export class Application {
  private dataStore: DataStore;
  private background: Background;

  constructor () {
    this.dataStore = new DataStore();
    this.background = new Background();
  }

  public renderApplication = (data: IApplicationData) => {
    this.dataStore.setApplicationData(data);

    const parentContainer = document.getElementById(data.containerId)! as HTMLDivElement;
    parentContainer.innerHTML = '';

    const applicationHeight = this.dataStore.applicationHeightSelector();
    const applicationWidth = this.dataStore.applicationWidthSelector();
    const backgroundImageUrl = this.dataStore.backgroundImageUrlSelector();
    const images = this.dataStore.imagesSelector();
    const icons = this.dataStore.iconsWithTextSelector();

    parentContainer.style.width = `${applicationWidth}px`;
    parentContainer.style.height = `${applicationHeight}px`;
    this.addDragNDropListeners(parentContainer);
    this.addContextMenuHandler(parentContainer);

    this.background.setSize(applicationWidth, applicationHeight);
    this.background.setBackground(backgroundImageUrl);

    parentContainer.appendChild(this.background.getDom());

    for (const key in images) {
      if (images[key]) {
        const imageData = images[key];
        this.insertImage(imageData.imageUrl, parentContainer, imageData);
      }
    }

    for (const key in icons) {
      if (icons[key]) {
        const iconData = icons[key];
        this.insertIconWithText(parentContainer, iconData);
      }
    }
  }

  private insertImage = (imageUrl: string, parentContainer: HTMLDivElement, imageData?: IImage) => {
    const movableElement = spawnMovableElement(this.dataStore);
    movableElement.image.src = imageUrl;
    movableElement.image.onload = () => {
      if (imageData) {
        // Position as per data
        movableElement.image.style.left = `${imageData.left}px`;
        movableElement.image.style.top = `${imageData.top}px`;
        movableElement.setId(imageData.id);
        movableElement.image.height = movableElement.image.offsetHeight * imageData.scale;
      } else {
        const scale = Number(window.prompt('Please enter the scale percentage to resize (0 - 100)')) / 100;
        movableElement.image.height = movableElement.image.offsetHeight * scale;
        // Position canvas in center
        const backgroundWidth = this.background.getDom().offsetWidth;
        const backgroundHeight = this.background.getDom().offsetHeight;
        const left = backgroundWidth / 2 - movableElement.image.offsetWidth / 2;
        const top = backgroundHeight / 2 - movableElement.image.offsetHeight / 2;
        movableElement.image.style.left = `${left}px`;
        movableElement.image.style.top = `${top}px`;

        const id = uuid();
        this.dataStore.setImage({
          id,
          imageUrl,
          left,
          scale,
          top,
        });
        movableElement.setId(id);
      }
    };
    parentContainer.appendChild(movableElement.image);
  }

  private addDragNDropListeners = (parentContainer: HTMLDivElement) => {
    const FileSelectHandler = (event: DragEvent) => {
      event.stopPropagation();
      event.preventDefault();
      const file: File = event.dataTransfer!.files[0];

      const reader = new FileReader();

      reader.onload = () => {
        this.insertImage(reader.result as string, parentContainer);
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
  }

  private addContextMenuHandler = (parentContainer: HTMLDivElement) => {
    parentContainer.addEventListener('contextmenu', (event: MouseEvent) => {
      const element = event.target as HTMLElement;
      event.preventDefault();
      menu.renderMenu([
        {
          label: 'Insert Icon with Text',
          menuAction: () => this.insertIconWithText(parentContainer),
        },
        {
          label: 'Export Collage',
          menuAction: () => this.exportResults(parentContainer),
        },
        {
          label: 'Save',
          menuAction: () => this.exportJSONData(this.dataStore.getApplicationData()),
        },
        {
          label: 'Delete Element',
          menuAction: () => {
            const elementID = element.getAttribute('data-id');
            if (elementID) {
              this.dataStore.deleteIcon(elementID);
              this.dataStore.deleteImage(elementID);
              element.remove();
            }
          },
        },
      ]);
      menu.positionMenu(event.pageX, event.pageY);
    });
  }

  private getLocalSvg = (): Promise<string> => new Promise((resolve, reject) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/svg+xml';
    input.onchange = (event) => {
      const element: HTMLInputElement = event.target! as HTMLInputElement;
      const file = element.files && element.files[0];
      const reader = new FileReader();

      reader.onload = (e) => {
        const content = e.target?.result as string;
        const base64 = `data:image/svg+xml;base64,${window.btoa(content)}`;
        resolve(base64);
      };

      reader.onerror = (error) => {
        reject(error);
      };

      reader.readAsText(file!);
    };
    input.click();
  })

  private insertIconWithText = async (parentContainer: HTMLDivElement, iconData?: IIconsWithText) => {
    let iconWithText: IconWithText;
    if (iconData) {
      iconWithText = new IconWithText(iconData.imageUrl, iconData.title, iconData.description, 'iconWithText', iconData.id, this.dataStore);
      iconWithText.dom.style.left = `${iconData.left}px`;
      iconWithText.dom.style.top = `${iconData.top}px`;
    } else {
      const iconUrl: string = await this.getLocalSvg();
      const iconTitle: string = window.prompt('Please enter a Title')!;
      const iconDescription: string = window.prompt(`Please enter a Description for ${iconTitle}`)!;

      const id = uuid();
      iconWithText = new IconWithText(iconUrl, iconTitle, iconDescription, 'iconWithText', id, this.dataStore);
      const backgroundWidth = this.background.getDom().offsetWidth;
      const backgroundHeight = this.background.getDom().offsetHeight;
      const left = backgroundWidth / 2 - iconWithText.dom.offsetWidth / 2;
      const top = backgroundHeight / 2 - iconWithText.dom.offsetHeight / 2;
      iconWithText.dom.style.left = `${left}px`;
      iconWithText.dom.style.top = `${top}px`;

      this.dataStore.setIconWithText({
        description: iconDescription,
        id,
        imageUrl: iconUrl,
        left,
        scale: 1,
        title: iconTitle,
        top,
      });
    }

    parentContainer.appendChild(iconWithText.dom);
  }

  private exportJSONData = (applicationData: IApplicationData) => {
    document.dispatchEvent(new CustomEvent('collageExport', {
      detail: applicationData,
    }));
  }

  private exportResults = async (parentContainer: HTMLDivElement) => {
    const result = await html2canvas(parentContainer, { useCORS: true, allowTaint: true, scrollX: 0, scrollY: -window.scrollY });
    result.toBlob((blob) => {
      const link = document.createElement('a');
      link.download = `${Date.now()}.png`;
      link.href = window.URL.createObjectURL(blob);
      link.click();
    }, 'image/png');
  }
}
