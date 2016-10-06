import {getUrlParameters} from './shared/utils/helper';

export const DEFAULT_LOCATIONID = 77783;
export const DEFAULT_TAPPID = -2;
export const LOGIN_TAPPID = -1;
export const SYSTEM_URL_PARAMETERS = ['tappid', 'locationid', 'console', 'debug', 'tobitaccesstoken'];

let loginUrl = {
    devBase: 'http://localhost:8080/',
    qaBase: 'https://tappqa.tobit.com/tapps/LoginTapp/',
    liveBase: 'https://tapp03.tobit.com/ChaynsWebLightLogin/',
    urlParameter: '?AppVersion=##version##&OS=##os##&colormode=##colormode##&color=##color##&apname=##apname##&tappid=-1'
};
export let LOGIN_TAPP = {
    id: '-1',
    url: ((getUrlParameters().login === 'dev') ? loginUrl.devBase : (getUrlParameters().login === 'qa') ? loginUrl.qaBase : loginUrl.liveBase) + loginUrl.urlParameter,
};