import { BaseCanvas } from './Canvas';

export class Background extends BaseCanvas {
  public setSize = (width: number, height: number) => {
    this.canvas.width = width;
    this.canvas.height = height;
  }
}

export const background = new Background();
