import logger from 'chayns-logger';
import { loadTapp } from './tapp/custom-tapp';
import { loadLocation } from './chayns-info';
import { setDynamicStyle } from './ui/dynamic-style';
import Navigation from './ui/navigation';
import { validateTobitAccessToken, getUrlParameters, stringisEmptyOrWhitespace } from './utils/helper';
import { decodeTobitAccessToken } from './utils/convert';
import { getAccessToken, setAccessToken, resizeWindow } from './utils/native-functions';

import { DEFAULT_LOCATIONID, DEFAULT_TAPPID, LOGIN_TAPPID } from './constants/config';
import TAPPIDS from './constants/tapp-ids';

document.addEventListener('DOMContentLoaded', () => {
    let tappId = getUrlParameters().tappid;
    let locationId = parseInt(getUrlParameters().locationid, 10);

    if (parseInt(tappId, 10) === -7) {
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

        setAccessToken(parameterAccessToken);
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

    // start of ChaynsWebLight
    loadLocation(locationId).then(() => {
        setDynamicStyle();

        const tobitAccessToken = getAccessToken();

        if (tappId !== LOGIN_TAPPID && validateTobitAccessToken(tobitAccessToken)) {
            loadTapp(tappId);
        } else {
            logger.info({
                message: 'show login tapp',
                customNumber: tappId
            });

            resizeWindow(566, 766);
            Navigation.hide();
            loadTapp(LOGIN_TAPPID);
        }
    });
}, false);
