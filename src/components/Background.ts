import { BaseCanvas } from './Canvas';

export class Background extends BaseCanvas {
  constructor() {
    super();
    this.expandToScreenSize();
  }

  private expandToScreenSize = () => {
    this.canvas.width = document.documentElement.clientWidth;
    this.canvas.height = document.documentElement.clientHeight;
  }
}

export const background = new Background();
