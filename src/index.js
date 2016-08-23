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

import ChaynsInfo from './ChaynsInfo';
window.ChaynsInfo = ChaynsInfo;

require('./chaynsWeb');
//require('./utils/jsonCalls');
//require('./utils/customTappCommunication');