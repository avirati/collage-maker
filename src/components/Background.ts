import { BaseCanvas } from './Canvas';

export class Background extends BaseCanvas {
  public setSize = (width: number, height: number) => {
    this.image.width = width;
    this.image.height = height;
  }

  public setBackground = (url: string) => {
    this.image.src = url;
  }
}

export const background = new Background();
