import logger from 'chayns-logger';

import './shared/utils/polyfill';
import './web/customTappCommunication';
import './web/jsonCalls';
import './web/chaynsWeb';
import './config';
import Console from './shared/utils/console';
import Navigation from './shared/utils/navigation';
import generateUUID from './shared/utils/generate-uuid';

import './style/index.scss';

// catches chayns error
chayns.ready.catch((ex) => {
    // ignore
});

//init logger
logger.init({
    applicationUid: 'B150BF1E-A955-4073-B3DD-4F2CEC864C6A',
    overrideOnError: true,
    sessionUid: generateUUID(),
    throttleTime: 100,
    useDevServer: process.env.NODE_ENV === ENV.DEV
});

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

