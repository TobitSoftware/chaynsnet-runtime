import {loadTapp} from './customTapp';
import {loginTappId} from '../config/customTapps';
import Textstrings from '../shared/utils/textstings';
import {validateTobitAccessToken, getUrlParameters} from '../shared/utils/helper';
import Dialog from '../shared/dialog';
import {getAccessToken, resizeWindow} from '../shared/utils/native-functions';

document.addEventListener('DOMContentLoaded', () => {
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
        if (validateTobitAccessToken(tobitAccessToken)) {
            loadTapp((tappId !== loginTappId) ? tappId : '-7');
        } else {
            resizeWindow(566, 766);
            loadTapp(loginTappId);
        }
    });
}, false);


