import { Application } from './App';

import './style.css';

(window as any).Application = Application;

document.dispatchEvent(new CustomEvent('collageReady'));