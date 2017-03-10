import { loadTapp } from './tapp/custom-tapp';
import { setAccessToken, closeWindow, resizeWindow } from './utils/native-functions';
import LOGIN_TAPP from './constants/login-tapp';
import Navigation from './ui/navigation';

export function login() {
    resizeWindow(566, 766);
    Navigation.hide();
    loadTapp(LOGIN_TAPP.id);
}

export function logout() {
    setAccessToken('');
    closeWindow();
    location.reload();
}
