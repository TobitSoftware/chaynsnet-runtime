import changeEnv from './utils/change-env';
import { loadTapp } from './tapp/custom-tapp';
import { callBackHandler } from './json-native-calls/json-native-calls';

import { ENVIRONMENTS } from './constants/environments';
import TAPPIDS from './constants/tapp-ids';

window.changeEnv = changeEnv;
window.ENV = ENVIRONMENTS;

window.loadTapp = loadTapp;
window.TAPPIDS = TAPPIDS;

window.external.callback = callBackHandler;
