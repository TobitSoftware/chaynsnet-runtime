import logger from 'chayns-logger';
import loadTapp, { getTappById } from './tapp/custom-tapp';
import { loadLocation, loadTapps, chaynsInfo } from './chayns-info';
import setDynamicStyle from './ui/dynamic-style';
import Navigation from './ui/navigation';
import { validateTobitAccessToken, stringisEmptyOrWhitespace } from './utils/helper';
import { getUrlParameters, set } from './utils/url-parameter';
import { decodeTobitAccessToken } from './utils/convert';
import { setTobitAccessToken, getTobitAccessToken } from './json-native-calls/calls/index';
import { showLogin } from './login';
import ConsoleLogger from './utils/console-logger';

import LOGIN_TAPP_ID from './constants/login-tapp-id';
import { DEFAULT_LOCATIONID, DEFAULT_TAPPID } from './constants/defaults';
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
        message: 'chayns®net runtime requested',
        locationId,
        customNumber: tappId,
    });

    const parameterAccessToken = getUrlParameters().accesstoken;
    if (!stringisEmptyOrWhitespace(parameterAccessToken) && validateTobitAccessToken(parameterAccessToken)) {
        const decodedToken = decodeTobitAccessToken(parameterAccessToken);
        locationId = decodedToken.LocationID;

        setTobitAccessToken(parameterAccessToken);
        logger.info({
            message: 'accessToken as URLParameter',
            personId: decodedToken.PersonID,
        });

        if (decodedToken.roles && decodedToken.roles.indexOf('tobitBuha') !== -1) {
            Navigation.disableTappId(TAPPIDS.INTERCOM);
        }
    } else if (!locationId || !tappId) {
        if (!locationId) {
            set('locationId', DEFAULT_LOCATIONID);
            locationId = DEFAULT_LOCATIONID;
        }

        if (!tappId) {
            set('tappId', DEFAULT_TAPPID);
            tappId = DEFAULT_TAPPID;
        }
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

async function init(tappId) {
    try {
        await loadTapps();

        const tobitAccessToken = chaynsInfo.User.TobitAccessToken;

        const tapp = getTappById(tappId);

        if ((!tapp && !validateTobitAccessToken(tobitAccessToken)) || 'forcelogin' in getUrlParameters()) {
            logger.info({
                message: `show login tapp (${'forcelogin' in getUrlParameters() ? 'forcelogin' : 'no tapp found'})`,
                customNumber: tappId
            });

            showLogin();
            return;
        }

        if (!tapp) {
            consoleLogger.warn('No Tapp found!');

            let lang = (navigator.language || navigator.userLanguage).substring(0, 2) || 'en';
            if (!(lang.indexOf('de') > -1 || lang.indexOf('en') > -1)) {
                lang = 'en';
            }

            let message;
            if (lang === 'de') {
                message = `Der Tapp "${tappId}" existiert auf der Location "${chaynsInfo.LocationID}" nicht oder Ihnen fehlen die benötigten Berechtigungen.`;
            } else { // if lang === 'en'
                message = `The Tapp "${tappId}" does not exist on the location "${chaynsInfo.LocationID}" or you don't have the right permissions to see it.`;
            }

            Dialog.show(Dialog.type.ALERT, {
                message
            });

            logger.warning({
                message: 'no tapp found',
                customNumber: tappId,
                fileName: 'custom-tapp.js',
                section: 'loadTapp'
            });
            return;
        }

        if (tappId === LOGIN_TAPP_ID || (tapp.requiresLogin && !validateTobitAccessToken(tobitAccessToken))) {
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
            message: 'Init of chayns®net runtime failed.',
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

export default init;
