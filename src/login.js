import { chaynsInfo, updateUserData } from './chayns-info';
import loadTapp from './tapp/custom-tapp';
import { closeWindow, resizeWindow, setTobitAccessToken } from './json-native-calls/calls/index';
import Navigation from './ui/navigation';
import { init } from './chayns-web';
import { getUrlParameters, remove } from './utils/url-parameter';
import LOGIN_TAPP_ID from './constants/login-tapp-id';

let prevTappId = null;

export function showLogin() {
    resizeWindow(566, 766);
    Navigation.hide();

    const currentTappId = chaynsInfo.getGlobalData().AppInfo.TappSelected.Id;
    if (currentTappId && currentTappId !== LOGIN_TAPP_ID) {
        prevTappId = currentTappId;
    } else if (parseInt(getUrlParameters().tappid, 10) !== LOGIN_TAPP_ID) {
        prevTappId = parseInt(getUrlParameters().tappid, 10);
    } else {
        prevTappId = null;
    }

    loadTapp(LOGIN_TAPP_ID);
}

export function login(tobitAccessToken) {
    setTobitAccessToken(tobitAccessToken)
        .then(() => Promise.all([updateUserData(), closeWindow()]))
        .then(() => {
            remove('forcelogin');

            if (prevTappId) {
                init(prevTappId);
            }
        });
}

export function logout() {
    setTobitAccessToken('')
        .then(() => Promise.all([updateUserData(), closeWindow()]))
        .then(() => init(chaynsInfo.getGlobalData().AppInfo.TappSelected.Id));
}
