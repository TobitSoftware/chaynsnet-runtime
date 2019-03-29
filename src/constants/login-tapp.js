/* eslint-disable prefer-destructuring */
import getDavidVersion from '../utils/getDavidVersion';

export const LOGIN_TAPP_ID = -1;

const loginTapps = [
    'https://tapp03.tobit.com/ChaynsWebLightLogin/?AppVersion=##version##&OS=##os##&colormode=##colormode##&color=##color##&apname=##apname##&tappid=-1',
    'https://login.chayns.net/login/v3.0/index.html?desktop=1&staticMode&AppVersion=##version##&SiteID=##siteid##&OS=##os##&color=##color##&colormode=##colormode##&font=##fontid##',
];

const loginTapp = {
    id: LOGIN_TAPP_ID,
    url: loginTapps[1],
    fullSizeView: true,
    windowSize: {
        x: 566,
        y: 650,
    },
};

const davidVersion = getDavidVersion();

if (davidVersion !== null) {
    if (davidVersion.version < 7435) {
        loginTapp.url = loginTapps[0];
        loginTapp.fullSizeView = false;
        loginTapp.windowSize = {
            x: 566,
            y: 766,
        };
    } else {
        loginTapp.url = `${loginTapp.url}&siteColorBackground`;

        if (davidVersion.version < 7708) {
            loginTapp.url = `${loginTapp.url}&tokenType=1`;
        }
    }
}

export const LOGIN_TAPP = loginTapp;
