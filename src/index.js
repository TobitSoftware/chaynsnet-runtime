import logger from 'chayns-logger';
import './utils/polyfill';
import './tapp/customTappCommunication';
import './json-call/json-call-functions';
import './chaynsWeb';
import './constants/config';
import Console from './utils/console';
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

// Console && Navigation
Console.init();
Navigation.init();

// Activate Console by clicking activationElement
let timeout, count = 0;
let activateCB = () => {
    if (!timeout) {
        timeout = setTimeout(() => {
            count = 0;
            timeout = null;
        }, 10000);
    }
    count++;
    if (count > 5) {
        count = 0;
        Console.show();
        Navigation.show(true);
    }
};

let activationElements = document.querySelectorAll('.activationElement');
for (let element of activationElements) {
    element.addEventListener('click', activateCB);
}

