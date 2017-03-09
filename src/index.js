import logger from 'chayns-logger';
import './utils/polyfill';
import './tapp/custom-tapp-communication';
import './json-call/json-call-functions';
import './chayns-web';
import './constants/config';
import Navigation from './utils/navigation';
import './window-objects';

import { isLIVE } from './constants/environments';

import './style/index.scss';

chayns.ready.catch((ex) => {
    // ignore
});

logger.init({
    applicationUid: 'B150BF1E-A955-4073-B3DD-4F2CEC864C6A',
    overrideOnError: true,
    throttleTime: 100,
    useDevServer: !isLIVE
});

if (!isLIVE) {
    logger.setDefaults({
        env: process.env.NODE_ENV
    })
}

Navigation.init();
