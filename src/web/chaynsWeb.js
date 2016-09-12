import loadTapp from './customTapp';
import {getUrlParameters} from '../config/customTapps';
import Login from '../shared/login/login';
import Textstrings from '../shared/utils/textstings';
import {stringisEmptyOrWhitespace} from "../shared/utils/helper";
import {decodeTobitAccessToken} from "../shared/utils/convert";
import Dialog from '../shared/dialog';

let loginTappId = '-1';

document.addEventListener('DOMContentLoaded', () => {
    Textstrings.init().then(() => {
        let urlParameters = getUrlParameters();
        let tappId = urlParameters && urlParameters.tappid ? urlParameters.tappid : loginTappId;
        window.CustomTappCommunication.Init();

        window.alert = (message, title) => Dialog.show('alert', {
            title: title || null,
            message
        });

        if (tappId === loginTappId) {
            setTimeout(() => Login.run().then((tobitAccessToken) => {
                window.ChaynsInfo.User.TobitAccessToken = tobitAccessToken;
                console.log('login-res', tobitAccessToken);
                document.parentWindow.external.Window.Close();
            }), 500);
        } else {
            let tobitAccessToken = document.parentWindow.external.Chayns.GetAccessToken();
            console.log('tobitAccessToken', tobitAccessToken);
            var tokenData = decodeTobitAccessToken(tobitAccessToken);
            if (!stringisEmptyOrWhitespace(tobitAccessToken) && new Date(tokenData.exp) > new Date() && tokenData.LocationID === window.ChaynsInfo.LocationID) {
                loadTapp(tappId);
            }else {
                location.href = `${location.origin}${location.pathname}?tappid=-1`;
            }
        }
    });
}, false);

let $icons = document.querySelectorAll('.ChaynsIdIconPadding');

for (let i = 0, l = $icons.length; i < l; i++) {
    $icons[i].addEventListener('click', () => {
        loadTapp($icons[i].getAttribute('data-tappid'));
    });
}
