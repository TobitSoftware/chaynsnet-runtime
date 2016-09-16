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

chayns.ready.catch();

import ChaynsInfo from './web/chaynsInfo';
window.ChaynsInfo = ChaynsInfo;

require('./web/customTappCommunication');
require('./web/jsonCalls');
require('./web/chaynsWeb');