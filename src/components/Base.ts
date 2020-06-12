export abstract class Base {
  public image: HTMLImageElement;
  public id: string;

  constructor() {
    this.image = document.createElement('img');
    this.image.className = 'elements';
    this.id = '';
  }

  public setId = (id: string) => {
    this.id = id;
    this.image.setAttribute('data-id', id);
  }

  public getDom = () => this.image;
}
