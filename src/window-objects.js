import changeEnv from './utils/change-env'
import { loadTapp } from './tapp/custom-tapp';

import { ENVIRONMENTS } from './constants/environments';
import { TAPPIDS }  from './constants/tapp-ids';

window.changeEnv = changeEnv;
window.ENV = ENVIRONMENTS;

window.loadTapp = loadTapp;
window.TAPPIDS = TAPPIDS;