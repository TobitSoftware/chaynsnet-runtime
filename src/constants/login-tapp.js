/* eslint-disable prefer-destructuring */
import getDavidVersion from '../utils/getDavidVersion';

const loginTapps = [
    'https://tapp03.tobit.com/ChaynsWebLightLogin/?AppVersion=##version##&OS=##os##&colormode=##colormode##&color=##color##&apname=##apname##&tappid=-1',
    'https://login.chayns.net/chaynsLogin/index.html?AppVersion=##version##&SiteID=##siteid##&OS=##os##&color=##color##&colormode=##colormode##&font=##fontid##&resetCache',
    'https://login.chayns.net/chaynsLoginV2/index.html?AppVersion=##version##&SiteID=##siteid##&OS=##os##&color=##color##&colormode=##colormode##&font=##fontid##',
];
let loginTappUrl;

const davidVersion = getDavidVersion();

if (davidVersion !== null) {
    if (davidVersion.version < 7435) {
        loginTappUrl = loginTapps[0];
    } else if (davidVersion.version < 7708) {
        loginTappUrl = loginTapps[1];
    } else {
        loginTappUrl = loginTapps[2];
    }
} else {
    loginTappUrl = loginTapps[2];
}

export const LOGIN_TAPP_URL = loginTappUrl;
export const LOGIN_TAPP_ID = -1;
