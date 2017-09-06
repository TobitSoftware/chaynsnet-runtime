import { chaynsInfo, updateUserData } from './chayns-info';
import loadTapp from './tapp/custom-tapp';
import { closeWindow, resizeWindow, setTobitAccessToken } from './json-native-calls/calls/index';
import Navigation from './ui/navigation';
import LOGIN_TAPP from './constants/login-tapp';
import { getUrlParameters } from './utils/helper';
import { init } from './chayns-web';

let prevTappId = null;

export function showLogin() {
    resizeWindow(566, 766);
    Navigation.hide();

    const currentTappId = chaynsInfo.getGlobalData().AppInfo.TappSelected.Id;
    if (currentTappId && currentTappId !== LOGIN_TAPP.id) {
        prevTappId = currentTappId;
    } else if (parseInt(getUrlParameters().tappid, 10) !== LOGIN_TAPP.id) {
        prevTappId = parseInt(getUrlParameters().tappid, 10);
    } else {
        prevTappId = null;
    }

    loadTapp(LOGIN_TAPP.id)
}

export function login(tobitAccessToken) {
    setTobitAccessToken(tobitAccessToken)
        .then(() => Promise.all([updateUserData(), closeWindow()]))
        .then(() => {
            if (prevTappId) {
                init(prevTappId);
            }
        })
}

export function logout() {
    setTobitAccessToken('')
        .then(() => Promise.all([updateUserData(), closeWindow()]))
        .then(() => init(chaynsInfo.getGlobalData().AppInfo.TappSelected.Id));
}
