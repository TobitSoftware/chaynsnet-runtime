import loadTapp from './customTapp';
import {getUrlParameters} from '../config/customTapps';
import Login from '../shared/login/login';
import Textstrings from '../shared/utils/textstings';
import Dialog from '../shared/dialog';

document.addEventListener('DOMContentLoaded', () => {
    Textstrings.init().then(() => {
        let urlParameters = getUrlParameters();
        let tappId = urlParameters && urlParameters.tappid ? urlParameters.tappid : '-1';
        window.CustomTappCommunication.Init();

        window.alert = (message, title) => Dialog.show('alert', {
            title: title || null,
            message
        });

        if (tappId === '-1') {
            setTimeout(() => Login.run().then((tobitAccessToken) => {
                window.ChaynsInfo.User.TobitAccessToken = tobitAccessToken;
                console.log('login-res', tobitAccessToken);
            }), 1500);
        } else {
            loadTapp(tappId);
        }
    });
}, false);