import { IApplicationData, IIconsWithText, IImage } from './interfaces';

const data: IApplicationData = {
  applicationHeight: 0,
  applicationWidth: 0,
  backgroundImageUrl: '',
  iconsWithText: {},
  images: {},
};

export const applicationHeightSelector = () => data.applicationHeight;
export const applicationWidthSelector = () => data.applicationWidth;
export const backgroundImageUrlSelector = () => data.backgroundImageUrl;
export const iconsWithTextSelector = () => data.iconsWithText;
export const imagesSelector = () => data.images;

export const setApplicationHeight = (value: number) => data.applicationHeight = value;
export const setApplicationWidth = (value: number) => data.applicationWidth = value;
export const setBackgroundImageUrl = (value: string) => data.backgroundImageUrl = value;
export const setIconWithText = (iconData: IIconsWithText) => data.iconsWithText[iconData.id] = iconData;
export const setImage = (imageData: IImage) => data.images[imageData.id] = imageData;

export const deleteImage = (id: string) => delete data.images[id];
export const deleteIcon = (id: string) => delete data.iconsWithText[id];

export const moveIconWithText = (id: string, left: number, top: number) => {
  data.iconsWithText[id].left = left;
  data.iconsWithText[id].top = top;
};
export const moveImage = (id: string, left: number, top: number) => {
  data.images[id].left = left;
  data.images[id].top = top;
};

export const clearIcons = () => data.iconsWithText = {};
export const clearImages = () => data.images = {};

export const setApplicationData = (applicationData: IApplicationData) => {
  setApplicationHeight(applicationData.applicationHeight);
  setApplicationWidth(applicationData.applicationWidth);
  setBackgroundImageUrl(applicationData.backgroundImageUrl);

  clearIcons();
  clearImages();

  for (const key in applicationData.iconsWithText) {
    if (applicationData.iconsWithText[key]) {
      setIconWithText(applicationData.iconsWithText[key]);
    }
  }

  for (const key in applicationData.images) {
    if (applicationData.images[key]) {
      setImage(applicationData.images[key]);
    }
  }
};

export const getApplicationData = () => data;
