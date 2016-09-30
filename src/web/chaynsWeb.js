import {loadTapp} from './customTapp';
import {loginTappId} from '../shared/login';
import Textstrings from '../shared/utils/textstings';
import {validateTobitAccessToken, getUrlParameters} from '../shared/utils/helper';
import Dialog from '../shared/dialog';
import {getAccessToken, resizeWindow} from '../shared/utils/native-functions';
import {loadLocation} from './chaynsInfo';
import {setDynamicStyle} from '../shared/dynamic-style';

document.addEventListener('DOMContentLoaded', () => {
    loadLocation(getUrlParameters().locationid).then(() => {
        setDynamicStyle();
        Textstrings.init().then(() => {
            let urlParameters = getUrlParameters();
            let tappId = urlParameters && urlParameters.tappid ? urlParameters.tappid : loginTappId;
            window.CustomTappCommunication.Init();

            window.alert = (message, title) => Dialog.show('alert', {
                title: title || null,
                message
            });
            let tobitAccessToken = getAccessToken();
            console.log('tobitAccessToken', tobitAccessToken);
            if (tappId !== loginTappId && validateTobitAccessToken(tobitAccessToken)) {
                loadTapp(tappId);
            } else {
                resizeWindow(566, 766);
                loadTapp(loginTappId);
            }
        });
    });
}, false);


