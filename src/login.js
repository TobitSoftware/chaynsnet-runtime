import loadTapp from './tapp/custom-tapp';
import { closeWindow, resizeWindow, setTobitAccessToken } from './json-native-calls/calls/index';
import Navigation from './ui/navigation';
import LOGIN_TAPP from './constants/login-tapp';
import NATIVE_CALL_STATUS from './constants/native-calls-status';

export function showLogin() {
    resizeWindow(566, 766);
    Navigation.hide();
    loadTapp(LOGIN_TAPP.id);
}

export function login(tobitAccessToken) {
    setTobitAccessToken(tobitAccessToken);
    closeWindow()
        .then((res) => {
            if (res.status.code === NATIVE_CALL_STATUS.NOT_AVAILABLE) {
                location.reload();
            }
        });
}

export function logout() {
    setTobitAccessToken('');
    closeWindow()
        .then((res) => {
            if (res.status.code === NATIVE_CALL_STATUS.NOT_AVAILABLE) {
                location.reload();
            }
        });
}
