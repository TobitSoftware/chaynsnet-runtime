import './style/index.scss';
import logger from 'chayns-logger';

//IE Fix
if (!window.location.origin) {
    window.location.origin = `${window.location.protocol}//${window.location.hostname}${(window.location.port ? `:${window.location.port}` : '')}`;
}

//IE Console-Fix
if (typeof window.console === 'undefined') {
    window.console = {
        log: Function.prototype,
        error: Function.prototype
    };
}

import './config';

chayns.ready.catch((ex) => {});
//init logger
logger.init({
    applicationUid: 'B150BF1E-A955-4073-B3DD-4F2CEC864C6A',
    overrideOnError: true,
    sessionUid: generateUUID(),
    throttleTime: 100,
    useDevServer: process.env.NODE_ENV === ENV.DEV
});

//Console && Navigation
import Console from './shared/utils/console';
Console.init();
import Navigation from './shared/utils/navigation';
Navigation.init();
(function consoleNavigationActivation() {
    let timeout,
        count = 0;
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
})();

import './web/customTappCommunication';
import './web/jsonCalls';
import './web/chaynsWeb';