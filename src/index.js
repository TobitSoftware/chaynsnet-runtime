import logger from 'chayns-logger';
import './utils/polyfill';
import './tapp/custom-tapp-communication';
import './json-call/json-call-functions';
import './chaynsWeb';
import './constants/config';
import Navigation from './utils/navigation';

import { ENV } from './constants/config';

import './style/index.scss';

// catches chayns error
chayns.ready.catch((ex) => {
    // ignore
});

//init logger
logger.init({
    applicationUid: 'B150BF1E-A955-4073-B3DD-4F2CEC864C6A',
    overrideOnError: true,
    throttleTime: 100,
    useDevServer: process.env.NODE_ENV !== ENV.LIVE
});
if (process.env.NODE_ENV !== ENV.LIVE) {
    logger.setDefaults({
        env: process.env.NODE_ENV
    })
}
Navigation.init();
