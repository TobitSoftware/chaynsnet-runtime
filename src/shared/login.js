import {loadTapp} from '../web/customTapp';
import {setAccessToken, closeWindow} from './utils/native-functions';
import {LOGIN_TAPPID} from '../config';

export function login() {
    loadTapp(LOGIN_TAPPID);
}

export function logout() {
    setAccessToken('');
    closeWindow();
    location.reload();
}