/* eslint-disable prefer-destructuring */
import getDavidVersion from '../utils/getDavidVersion';

export const LOGIN_TAPP_ID = -1;

const loginTapps = [
    'https://tapp03.tobit.com/ChaynsWebLightLogin/?AppVersion=##version##&OS=##os##&colormode=##colormode##&color=##color##&apname=##apname##&tappid=-1',
    'https://login.chayns.net/chaynsLogin/index.html?AppVersion=##version##&SiteID=##siteid##&OS=##os##&color=##color##&colormode=##colormode##&font=##fontid##&resetCache',
    'https://login.chayns.net/login/v3.0/index.html?desktop=1&staticMode&AppVersion=##version##&SiteID=##siteid##&OS=##os##&color=##color##&colormode=##colormode##&font=##fontid##',
];

const loginTapp = {
    id: LOGIN_TAPP_ID,
    windowSize: {
        x: 566,
        y: 766,
    }
};

const davidVersion = getDavidVersion();

if (davidVersion !== null) {
    if (davidVersion.version < 7435) {
        loginTapp.url = loginTapps[0];
    } else if (davidVersion.version < 7708) {
        loginTapp.url = loginTapps[1];
    } else {
        loginTapp.url = `${loginTapps[2]}&siteColorBackground`;
        loginTapp.fullSizeView = true;
        loginTapp.windowSize = {
            x: 566,
            y: 650,
        };
    }
} else {
    loginTapp.url = loginTapps[2];
    loginTapp.fullSizeView = true;
}

export const LOGIN_TAPP = loginTapp;
