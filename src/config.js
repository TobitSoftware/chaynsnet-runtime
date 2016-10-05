import {getUrlParameters} from './shared/utils/helper';

export let defaultLocationId = 77783;
export let defaultTappId = -2;
export let loginTappId = -1;

let loginUrl = {
    devBase: 'http://localhost:8080/',
    qaBase: 'https://tappqa.tobit.com/tapps/LoginTapp/',
    liveBase: 'https://tapp03.tobit.com/ChaynsWebLightLogin/',
    urlParameter: '?AppVersion=##version##&OS=##os##&colormode=##colormode##&color=##color##&apname=##apname##&tappid=-1'
};
export let loginTapp = {
    id: '-1',
    url: ((getUrlParameters().login === 'dev') ? loginUrl.devBase : (getUrlParameters().login === 'qa') ? loginUrl.qaBase : loginUrl.liveBase) + loginUrl.urlParameter,
};