import loadTapp from './customTapp';
import {getUrlParameters} from '../config/customTapps';

document.addEventListener('DOMContentLoaded', () => {
    let urlParameters = getUrlParameters();
    let tappId = urlParameters && urlParameters.tappid ? urlParameters.tappid : '-7';
    console.debug('param', urlParameters);
    window.CustomTappCommunication.Init();

    loadTapp(tappId);
}, false );