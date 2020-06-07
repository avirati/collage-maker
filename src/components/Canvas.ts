export class BaseCanvas {
  public canvas: HTMLCanvasElement;
  public context: CanvasRenderingContext2D;

  constructor() {
    this.canvas = document.createElement('canvas');
    this.context = this.canvas.getContext('2d')!;
  }

  public getDom = () => this.canvas;
}
