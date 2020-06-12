import { Application } from './App';
import { BACKGROUND_IMAGE } from './globalConstants';
import { IApplicationData } from './interfaces';

import './style.css';

document.addEventListener('collageExport', (event) => {
  console.log((event as CustomEvent).detail);
});

document.addEventListener('collageImport', (event) => {
  new Application().renderApplication(
    (event as CustomEvent).detail as IApplicationData,
  );
});

document.dispatchEvent(new CustomEvent('collageImport', {
  detail: {
    applicationHeight: window.innerHeight,
    applicationWidth: window.innerWidth,
    backgroundImageUrl: BACKGROUND_IMAGE,
    containerId: 'containerOne',
    iconsWithText: {},
    images: {},
  },
}));

document.dispatchEvent(new CustomEvent('collageImport', {
  detail: {
    applicationHeight: window.innerHeight,
    applicationWidth: window.innerWidth,
    backgroundImageUrl: BACKGROUND_IMAGE,
    containerId: 'containerTwo',
    iconsWithText: {},
    images: {},
  },
}));
