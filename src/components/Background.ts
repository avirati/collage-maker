import { Base } from './Base';

export class Background extends Base {
  public setSize = (width: number, height: number) => {
    this.image.width = width;
    this.image.height = height;
  }

  public setBackground = (url: string) => {
    this.image.src = url;
  }
}
