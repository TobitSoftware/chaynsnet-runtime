import logger from 'chayns-logger';
import { chaynsInfo } from './chayns-info';
import './utils/polyfill';
import './tapp/custom-tapp-communication';
import './json-call/json-call-functions';
import './chayns-web';
import './constants/config';
import './window-objects';

import { isLIVE } from './constants/environments';

import './style/index.scss';

// ignore chayns error
chayns.ready.catch(() => false);

logger.init({
    applicationUid: 'B150BF1E-A955-4073-B3DD-4F2CEC864C6A',
    overrideOnError: true,
    throttleTime: 100,
    useDevServer: !isLIVE,
    middleware: (payload) => {
        if (payload.customText) {
            payload.data = {
                url: location.href,
                ...payload.data
            };
        } else {
            payload.customText = location.href;
        }

        if (chaynsInfo) {
            const activeTappId = chaynsInfo.getGlobalData().AppInfo.TappSelected.Id;
            if (activeTappId) {
                if (payload.customNumber) {
                    payload.data = {
                        tappId: activeTappId,
                        ...payload.data,
                    };
                } else {
                    payload.customNumber = activeTappId;
                }
            }

            payload = {
                locationId: chaynsInfo.LocationID,
                personId: chaynsInfo.User.PersonID,
                ...payload
            };
        }

        return true;
    }
});

if (!isLIVE) {
    logger.setDefaults({
        env: process.env.NODE_ENV
    });
}
