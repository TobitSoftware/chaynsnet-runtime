import {DEFAULT_LOCATIONID, DEFAULT_TAPPID, LOGIN_TAPPID} from '../config';
import {loadTapp} from './customTapp';
import Textstrings from '../shared/utils/textstings';
import {validateTobitAccessToken, getUrlParameters} from '../shared/utils/helper';
import Dialog from '../shared/dialog';
import {getAccessToken, resizeWindow} from '../shared/utils/native-functions';
import {loadLocation} from './chaynsInfo';
import {setDynamicStyle} from '../shared/dynamic-style';

document.addEventListener('DOMContentLoaded', () => {

    //Reloads after appends missing parameters
    if (!getUrlParameters().locationid || !getUrlParameters().tappid) {
        let url = `${location.href}${location.href.indexOf('?') === -1 ? '?' : '&'}`;

        if (!getUrlParameters().locationid) {
            url += `${url.endsWith('&') || url.endsWith('?') ? '' : '&'}locationid=${defaultLocationId}`
        }

        if (!getUrlParameters().tappid) {
            url += `${url.endsWith('&') || url.endsWith('?') ? '' : '&'}tappId=${defaultTappId}`
        }
        location.href = url;
        return;
    }

    loadLocation(getUrlParameters().locationid).then(() => {
        setDynamicStyle();
        Textstrings.init().then(() => {
            let tappId = getUrlParameters().tappid;
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


