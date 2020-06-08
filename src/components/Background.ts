import { BaseCanvas } from './Canvas';

export class Background extends BaseCanvas {
  public setSize = (width: number, height: number) => {
    this.canvas.width = width;
    this.canvas.height = height;
  }

  public setBackground = (url: string) => {
    const image = document.createElement('img');
    image.src = url;
    image.width = this.canvas.width;
    image.onload = () => {
      this.context.drawImage(image, 0, 0, this.canvas.width, this.canvas.height);
    };
  }
}

export const background = new Background();
