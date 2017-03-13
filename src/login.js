import loadTapp from './tapp/custom-tapp';
import { closeWindow, resizeWindow, setTobitAccessToken } from './json-native-calls/calls/index';
import LOGIN_TAPP from './constants/login-tapp';
import Navigation from './ui/navigation';

export function login() {
    resizeWindow(566, 766);
    Navigation.hide();
    loadTapp(LOGIN_TAPP.id);
}

export function logout() {
    setTobitAccessToken('');
    closeWindow();
    location.reload();
}
