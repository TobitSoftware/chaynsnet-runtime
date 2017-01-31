import {DEFAULT_LOCATIONID, DEFAULT_TAPPID, LOGIN_TAPPID} from '../config';
import {loadTapp} from './customTapp';
import logger from 'chayns-logger';
import Textstrings from '../shared/utils/textstings';
import {validateTobitAccessToken, getUrlParameters, stringisEmptyOrWhitespace} from '../shared/utils/helper';
import {decodeTobitAccessToken} from '../shared/utils/convert';
import Dialog from '../shared/dialog';
import {getAccessToken, setAccessToken, resizeWindow} from '../shared/utils/native-functions';
import {loadLocation} from './chaynsInfo';
import {setDynamicStyle} from '../shared/dynamic-style';
import Navigation from '../shared/utils/navigation';

document.addEventListener('DOMContentLoaded', () => {

    let tappId = getUrlParameters().tappid,
        locationId = getUrlParameters().locationid,
        tobitAccessToken = getUrlParameters().accesstoken;

    if (tappId == -7) {
        tappId = -2;
    }

    logger.info({
        message: 'ChaynsWebLight requested',
        data: {
            tappId,
            locationId
        }
    });

    if (!stringisEmptyOrWhitespace(tobitAccessToken) && validateTobitAccessToken(tobitAccessToken)) {
        let decodedToken = decodeTobitAccessToken(tobitAccessToken);
        locationId = decodedToken.LocationID;
        tappId = DEFAULT_TAPPID;

        setAccessToken(tobitAccessToken);
        logger.info({
            message: 'accessToken as URLParameter',
            data: {
                userId: decodedToken.TobitUserID,
            }
        });

        if (decodedToken.roles.indexOf('tobitBuha') !== -1 && getUrlParameters().debug !== '1') {
            document.querySelector('.navigation__element[data-tappid="251441"]').classList.add('hidden');
        }

    } else if ((!locationId || !tappId)) {
        let url = `${location.href}${location.href.indexOf('?') === -1 ? '?' : '&'}`;

        if (!locationId) {
            url += `${url.endsWith('&') || url.endsWith('?') ? '' : '&'}locationid=${DEFAULT_LOCATIONID}`
        }

        if (!tappId) {
            url += `${url.endsWith('&') || url.endsWith('?') ? '' : '&'}tappId=${DEFAULT_TAPPID}`
        }
        location.href = url;
        return;
    }

    //start of ChaynsWebLight
    loadLocation(locationId).then(() => {

        setDynamicStyle();
        Textstrings.init().then(() => {
            window.CustomTappCommunication.Init();

            window.alert = (message, title) => Dialog.show('alert', {
                title: title || null,
                message
            });

            let tobitAccessToken = getAccessToken();
            console.log('tobitAccessToken', tobitAccessToken);

            if (tappId !== LOGIN_TAPPID && validateTobitAccessToken(tobitAccessToken)) {
                loadTapp(tappId);
            } else {

                logger.info({
                    message: 'show login tapp',
                    data: {
                        tappId
                    }
                });

                resizeWindow(566, 766);
                Navigation.hide();
                loadTapp(LOGIN_TAPPID);
            }
        });
    });
}, false);


