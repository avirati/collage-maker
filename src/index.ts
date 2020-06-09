import { renderApplication } from './App';
import { BACKGROUND_IMAGE } from './globalConstants';
import { IApplicationData } from './interfaces';

import './style.css';

document.addEventListener('collageExport', (event) => {
  console.log((event as CustomEvent).detail);
});

document.addEventListener('collageImport', (event) => {
  renderApplication(
    document.getElementById('root') as HTMLDivElement,
    (event as CustomEvent).detail as IApplicationData,
  );
});

document.dispatchEvent(new CustomEvent('collageImport', {
  detail: {
    applicationHeight: 600,
    applicationWidth: 800,
    backgroundImageUrl: BACKGROUND_IMAGE,
    iconsWithText: {},
    images: {},
  },
}));
