/* eslint-disable no-param-reassign */
import logger from 'chayns-logger';
import { chaynsInfo } from './chayns-info';
import { getUrlParameters } from './utils/url-parameter';
import ConsoleLogger from './utils/console-logger';
import './tapp/custom-tapp-communication';
import './chayns-web';
import './constants/system-url-parameter';
import './window-objects';

import VERSION from './constants/version';
import { isLIVE } from './constants/environments';

import './style/index.scss';

logger.init({
    applicationUid: 'B150BF1E-A955-4073-B3DD-4F2CEC864C6A',
    overrideOnError: true,
    throttleTime: 100,
    useDevServer: !isLIVE,
    version: VERSION,
    middleware: (payload) => {
        try {
            if (payload.customText) {
                payload.data = {
                    url: window.location.href,
                    ...payload.data
                };
            } else {
                payload.customText = window.location.href;
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
                    personId: chaynsInfo.User && chaynsInfo.User.PersonID,
                    ...payload
                };
            }
            return true;
        } catch (e) {
            console.error('logger-middleware-error', e);

            payload.data = {
                ...payload.data,
                middlewareErrorMessage: e.message
            };
            return true;
        }
    }
});

const logLevelParameter = parseInt(getUrlParameters().loglevel, 10);

if (!Number.isNaN(logLevelParameter)) {
    ConsoleLogger.setLevel(logLevelParameter);
} else if ('debug' in getUrlParameters()) {
    ConsoleLogger.setLevel(ConsoleLogger.LEVELS.DEBUG);
} else if (!isLIVE) {
    ConsoleLogger.setLevel(ConsoleLogger.LEVELS.INFO);
}
