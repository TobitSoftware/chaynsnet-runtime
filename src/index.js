import './style/index.scss';

import './shared/utils/console';

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


//WorkAround for chrome

/*document.parentWindow = {
    external: {
        PutKeyValue: (name, value) => {
            localStorage.setItem(name, value);
        },
        GetKeyValue: (name) => {
            return localStorage.getItem(name);
        }
    }
};*/


import ChaynsInfo from './web/chaynsInfo';
window.ChaynsInfo = ChaynsInfo;

require('./web/customTappCommunication');
require('./web/jsonCalls');
require('./web/login');
require('./web/chaynsWeb');