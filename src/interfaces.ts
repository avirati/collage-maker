export interface IImage {
  imageUrl: string;
  top: number;
  left: number;
}

export interface IIconsWithText extends IImage {
  title: string;
  description: string;
}

export interface IApplicationData {
  applicationWidth: number;
  applicationHeight: number;
  backgroundImageUrl: string;

  images?: IImage[];
  iconsWithText?: IIconsWithText[];
}
