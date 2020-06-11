export interface IImage {
  id: string;
  imageUrl: string;
  top: number;
  left: number;
  scale: number;
}

export interface IIconsWithText extends IImage {
  title: string;
  description: string;
}

export interface IApplicationData {
  applicationWidth: number;
  applicationHeight: number;
  backgroundImageUrl: string;

  images: {
    [key: string]: IImage;
  };
  iconsWithText: {
    [key: string]: IIconsWithText;
  };
}
