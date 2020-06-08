import { renderApplication } from './App';

import './style.css';

renderApplication(
  document.getElementById('root') as HTMLDivElement,
  {
    applicationHeight: 600,
    applicationWidth: 800,
    backgroundImageUrl: 'https://media.istockphoto.com/photos/bright-blue-defocused-blurred-motion-abstract-background-picture-id1047234038?k=6&m=1047234038&s=612x612&w=0&h=O1lP8GIn46sboZL5bnMsznd4A1tRNJ7iXm1MMVh5I5c=',
    iconsWithText: {},
    images: {},
  },
);
