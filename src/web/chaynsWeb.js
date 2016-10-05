import {loadTapp} from './customTapp';
import Textstrings from '../shared/utils/textstings';
import {validateTobitAccessToken, getUrlParameters} from '../shared/utils/helper';
import Dialog from '../shared/dialog';
import {getAccessToken, resizeWindow} from '../shared/utils/native-functions';
import {loadLocation} from './chaynsInfo';
import {setDynamicStyle} from '../shared/dynamic-style';
import {defaultLocationId, defaultTappId, loginTappId} from '../config';

document.addEventListener('DOMContentLoaded', () => {
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

            if (tappId !== loginTappId && validateTobitAccessToken(tobitAccessToken)) {
                if (tappId == -7) {
                    tappId = -2;
                }

                loadTapp(tappId);
            } else {
                resizeWindow(566, 766);
                loadTapp(loginTappId);
            }
        });
    });
}, false);


