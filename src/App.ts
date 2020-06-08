import { background } from './components/Background';
import { spawnMovableElement } from './components/MovableElements';

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
}

export const renderApplication = (parentContainer: HTMLDivElement) => {
  parentContainer.appendChild(background.getDom());
  addDragNDropListeners(parentContainer);
};
