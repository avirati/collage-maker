import { renderApplication } from './App';
import { BACKGROUND_IMAGE } from './globalConstants';

import './style.css';

renderApplication(
  document.getElementById('root') as HTMLDivElement,
  {
    applicationHeight: 600,
    applicationWidth: 800,
    backgroundImageUrl: BACKGROUND_IMAGE,
    iconsWithText: {},
    images: {},
  },
);
