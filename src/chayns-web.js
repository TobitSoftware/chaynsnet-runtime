import logger from 'chayns-logger';
import loadTapp, { getTappById } from './tapp/custom-tapp';
import { loadLocation } from './chayns-info';
import { setDynamicStyle } from './ui/dynamic-style';
import Navigation from './ui/navigation';
import { validateTobitAccessToken, getUrlParameters, stringisEmptyOrWhitespace } from './utils/helper';
import { decodeTobitAccessToken } from './utils/convert';
import { setTobitAccessToken, getTobitAccessToken } from './json-native-calls/calls/index';
import { showLogin } from './login';
import ConsoleLogger from './utils/console-logger';

import { DEFAULT_LOCATIONID, DEFAULT_TAPPID } from './constants/defaults';
import LOGIN_TAPP from './constants/login-tapp';
import TAPPIDS from './constants/tapp-ids';

const consoleLogger = new ConsoleLogger('(chayns-web.js)');


function init() {
    let tappId = parseInt(getUrlParameters().tappid, 10);
    let locationId = parseInt(getUrlParameters().locationid, 10);

    if (tappId === -7) {
        tappId = -2;
    }

    logger.info({
        message: 'ChaynsWebLight requested',
        locationId,
        customNumber: tappId,
    });

    const parameterAccessToken = getUrlParameters().accesstoken;
    if (!stringisEmptyOrWhitespace(parameterAccessToken) && validateTobitAccessToken(parameterAccessToken)) {
        const decodedToken = decodeTobitAccessToken(parameterAccessToken);
        locationId = decodedToken.LocationID;
        tappId = DEFAULT_TAPPID;

        setTobitAccessToken(parameterAccessToken);
        logger.info({
            message: 'accessToken as URLParameter',
            personId: decodedToken.PersonID,
        });

        if (decodedToken.roles.indexOf('tobitBuha') !== -1) {
            Navigation.disableTappId(TAPPIDS.INTERCOM);
        }
    } else if (!locationId || !tappId) {
        let url = `${location.href}${location.href.indexOf('?') === -1 ? '?' : '&'}`;

        if (!locationId) {
            url += `${url.endsWith('&') || url.endsWith('?') ? '' : '&'}locationid=${DEFAULT_LOCATIONID}`;
        }

        if (!tappId) {
            url += `${url.endsWith('&') || url.endsWith('?') ? '' : '&'}tappId=${DEFAULT_TAPPID}`;
        }
        location.href = url;
        return;
    }

    Navigation.init();

    loadLocation(locationId).then(async(success) => {
        try {
            if (!success) {
                return;
            }

            setDynamicStyle();

            const getTobitAccessTokenRes = await getTobitAccessToken();
            const tobitAccessToken = getTobitAccessTokenRes.data.tobitAccessToken;

            const tapp = getTappById(tappId);
            if (!tapp) {
                consoleLogger.warn('No Tapp found!');
                logger.warning({
                    message: 'no tapp found',
                    locationId,
                    customNumber: tappId,
                    fileName: 'custom-tapp.js',
                    section: 'loadTapp'
                });
                return;
            }

            if (tappId === LOGIN_TAPP.id || (tapp.requiresLogin && !validateTobitAccessToken(tobitAccessToken))) {
                logger.info({
                    message: 'show login tapp',
                    locationId,
                    customNumber: tappId
                });

                showLogin();
            } else {
                loadTapp(tappId);
            }
        } catch (e) {
            consoleLogger.error(e);
            logger.error({
                message: 'Init of ChaynsWebLight failed.',
                locationId,
                customNumeber: tappId,
                fileName: 'chayns-web.js',
                section: 'loadLocation(locationId)',
                ex: {
                    message: e.message,
                    stackTrace: e.stack
                }
            });
        }
    });
}

document.addEventListener('DOMContentLoaded', () => init(), false);
