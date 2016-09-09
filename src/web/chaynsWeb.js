import loadTapp from './customTapp';
import {getUrlParameters} from '../config/customTapps';
import Login from '../shared/login/login';
import Textstrings from '../shared/utils/textstings';
import {stringisEmptyOrWhitespace} from "../shared/utils/helper";
import {decodeTobitAccessToken} from "../shared/utils/convert";


document.addEventListener('DOMContentLoaded', () => {
    Textstrings.init().then(() => {
        let urlParameters = getUrlParameters();
        let tappId = urlParameters && urlParameters.tappid ? urlParameters.tappid : '-7';
        window.CustomTappCommunication.Init();

        if (tappId === '-1') {
            setTimeout(() => Login.run().then((tobitAccessToken) => {
                window.ChaynsInfo.User.TobitAccessToken = tobitAccessToken;
                console.log('login-res', tobitAccessToken);
                location.href = `${location.origin}${location.pathname}?tappid=-7`;
            }), 1500);
        } else {
            let tobitAccessToken = document.parentWindow.external.GetKeyValue("TobitAccessToken");
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