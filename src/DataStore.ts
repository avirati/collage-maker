import { IApplicationData, IIconsWithText, IImage } from './interfaces';

export class DataStore {
  private data: IApplicationData = {
    applicationHeight: 0,
    applicationWidth: 0,
    backgroundImageUrl: '',
    containerId: '',
    iconsWithText: {},
    images: {},
  };

  public applicationHeightSelector = () => this.data.applicationHeight;
  public applicationWidthSelector = () => this.data.applicationWidth;
  public backgroundImageUrlSelector = () => this.data.backgroundImageUrl;
  public iconsWithTextSelector = () => this.data.iconsWithText;
  public imagesSelector = () => this.data.images;

  public setApplicationHeight = (value: number) => this.data.applicationHeight = value;
  public setApplicationWidth = (value: number) => this.data.applicationWidth = value;
  public setBackgroundImageUrl = (value: string) => this.data.backgroundImageUrl = value;
  public setIconWithText = (iconData: IIconsWithText) => this.data.iconsWithText[iconData.id] = iconData;
  public setImage = (imageData: IImage) => this.data.images[imageData.id] = imageData;
  public setContainerId = (containerId: string) => this.data.containerId = containerId;

  public deleteImage = (id: string) => delete this.data.images[id];
  public deleteIcon = (id: string) => delete this.data.iconsWithText[id];

  public moveIconWithText = (id: string, left: number, top: number) => {
    this.data.iconsWithText[id].left = left;
    this.data.iconsWithText[id].top = top;
  }
  public moveImage = (id: string, left: number, top: number) => {
    this.data.images[id].left = left;
    this.data.images[id].top = top;
  }

  public clearIcons = () => this.data.iconsWithText = {};
  public clearImages = () => this.data.images = {};

  public setApplicationData = (applicationData: IApplicationData) => {
    this.setApplicationHeight(applicationData.applicationHeight);
    this.setApplicationWidth(applicationData.applicationWidth);
    this.setBackgroundImageUrl(applicationData.backgroundImageUrl);
    this.setContainerId(applicationData.containerId);

    this.clearIcons();
    this.clearImages();

    for (const key in applicationData.iconsWithText) {
      if (applicationData.iconsWithText[key]) {
        this.setIconWithText(applicationData.iconsWithText[key]);
      }
    }

    for (const key in applicationData.images) {
      if (applicationData.images[key]) {
        this.setImage(applicationData.images[key]);
      }
    }
  }

  public getApplicationData = () => this.data;

}
