import logger from 'chayns-logger';
import loadTapp, { getTappById } from './tapp/custom-tapp';
import { loadLocation, loadTapps } from './chayns-info';
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
import Dialog from './ui/dialog/dialog';

const consoleLogger = new ConsoleLogger('(chayns-web.js)');

function startup() {
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

        if (decodedToken.roles && decodedToken.roles.indexOf('tobitBuha') !== -1) {
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

    loadLocation(locationId)
        .then((success) => {
            if (success) {
                setDynamicStyle();
                init(tappId);
            }
        });
}

export async function init(tappId) {
    try {
        await loadTapps();

        const getTobitAccessTokenRes = await getTobitAccessToken();
        const { tobitAccessToken } = getTobitAccessTokenRes.data;

        const tapp = getTappById(tappId);

        if ((!tapp && !validateTobitAccessToken(tobitAccessToken)) || getUrlParameters().forcelogin === '1') {
            logger.info({
                message: `show login tapp (${getUrlParameters().forcelogin === '1' ? 'forcelogin' : 'no tapp found'})`,
                customNumber: tappId
            });

            showLogin();
            return;
        }

        if (!tapp) {
            consoleLogger.warn('No Tapp found!');

            Dialog.show(Dialog.type.ALERT, {
                message: `The Tapp "${tappId}" does not exist on the location "${chaynsInfo.LocationID}" or you have not the right permissions to see it.`
            });

            logger.warning({
                message: 'no tapp found',
                customNumber: tappId,
                fileName: 'custom-tapp.js',
                section: 'loadTapp'
            });
            return;
        }

        if (tappId === LOGIN_TAPP.id || (tapp.requiresLogin && !validateTobitAccessToken(tobitAccessToken))) {
            logger.info({
                message: 'show login tapp',
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
            customNumeber: tappId,
            fileName: 'chayns-web.js',
            section: 'init',
            ex: {
                message: e.message,
                stackTrace: e.stack
            }
        });
    }
}

document.addEventListener('DOMContentLoaded', () => startup(), false);
