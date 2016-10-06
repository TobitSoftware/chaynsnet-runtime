import {DEFAULT_LOCATIONID, DEFAULT_TAPPID, LOGIN_TAPPID} from '../config';
import {loadTapp} from './customTapp';
import Textstrings from '../shared/utils/textstings';
import {validateTobitAccessToken, getUrlParameters, stringisEmptyOrWhitespace} from '../shared/utils/helper';
import {decodeTobitAccessToken} from '../shared/utils/convert';
import Dialog from '../shared/dialog';
import {getAccessToken, setAccessToken, resizeWindow} from '../shared/utils/native-functions';
import {loadLocation} from './chaynsInfo';
import {setDynamicStyle} from '../shared/dynamic-style';

document.addEventListener('DOMContentLoaded', () => {

    let tappId = getUrlParameters().tappid,
        locationId = getUrlParameters().locationid,
        tobitAccessToken = getUrlParameters().accesstoken;

    //Reloads after appends missing parameters
    if ((!locationId || !tappId) && stringisEmptyOrWhitespace(tobitAccessToken)) {
        let url = `${location.href}${location.href.indexOf('?') === -1 ? '?' : '&'}`;

        if (!locationId) {
            url += `${url.endsWith('&') || url.endsWith('?') ? '' : '&'}locationid=${DEFAULT_LOCATIONID}`
        }

        if (!tappId) {
            url += `${url.endsWith('&') || url.endsWith('?') ? '' : '&'}tappId=${DEFAULT_TAPPID}`
        }
        location.href = url;
        return;
    } else {
        locationId = DEFAULT_LOCATIONID;
        tappId = DEFAULT_TAPPID;
    }

    //check if accessToken in parameters and updates locationId
    if (!stringisEmptyOrWhitespace(tobitAccessToken) && validateTobitAccessToken(tobitAccessToken)) {
        let decodedToken = decodeTobitAccessToken(tobitAccessToken);
        locationId = decodedToken.LocationID;
        setAccessToken(tobitAccessToken);

        if(decodedToken.roles.indexOf('tobitBuha') !== -1 && getUrlParameters().debug !== '1'){
            document.querySelector('.navigation__element[data-tappid="251441"]').classList.add('hidden');
        }
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
                if (tappId == -7) {
                    tappId = -2;
                }

                loadTapp(tappId);
            } else {
                resizeWindow(566, 766);
                loadTapp(LOGIN_TAPPID);
            }
        });
    });
}, false);


