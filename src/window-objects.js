import changeEnv from './utils/change-env';
import loadTapp from './tapp/custom-tapp';
import { callbackHandler } from './json-native-calls/json-native-calls';
import ConsoleLogger from './utils/console-logger';

import { ENVIRONMENTS } from './constants/environments';
import TAPPIDS from './constants/tapp-ids';

window.cwl = {
    ConsoleLogger,
    changeEnv,
    ENV: ENVIRONMENTS,
    loadTapp,
    TAPPIDS,
};

try {
    window.external = {
        ...window.external,
        callback: callbackHandler
    };
} catch (e) {
    new ConsoleLogger('window-objects').info('window.external is readonly');
}
