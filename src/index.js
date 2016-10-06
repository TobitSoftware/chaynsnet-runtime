import './style/index.scss';

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

chayns.ready.catch((ex)=>{});

import './config';
import './shared/utils/console';

import ChaynsInfo from './web/chaynsInfo';
window.ChaynsInfo = ChaynsInfo;

import './web/customTappCommunication';
import './web/jsonCalls';
import './web/chaynsWeb';