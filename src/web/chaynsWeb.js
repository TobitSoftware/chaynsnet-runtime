import loadTapp from './customTapp';
import {getUrlParameters} from '../config/customTapps';
import Login from '../shared/login/login';
import Textstrings from '../shared/utils/textstings';


document.addEventListener('DOMContentLoaded', () => {
    Textstrings.init().then(() => {
        let urlParameters = getUrlParameters();
        let tappId = urlParameters && urlParameters.tappid ? urlParameters.tappid : '-7';
        window.CustomTappCommunication.Init();

        if (tappId === '-7') {
            setTimeout(() => Login.run().then((tobitAccessToken) => {
                window.ChaynsInfo.User.TobitAccessToken = tobitAccessToken;
                console.log('login-res', tobitAccessToken);
            }), 1500);
        } else {
            loadTapp(tappId);
        }
    });
}, false);