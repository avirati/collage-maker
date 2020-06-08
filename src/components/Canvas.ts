export class BaseCanvas {
  public canvas: HTMLCanvasElement;
  public context: CanvasRenderingContext2D;
  public id: string;

  constructor() {
    this.canvas = document.createElement('canvas');
    this.context = this.canvas.getContext('2d')!;
    this.id = '';
  }

  public setId = (id: string) => this.id = id;

  public getDom = () => this.canvas;
}
