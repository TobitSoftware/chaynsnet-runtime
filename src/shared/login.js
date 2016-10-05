import {loadTapp} from '../web/customTapp';
import {setAccessToken, closeWindow} from './utils/native-functions';
import {loginTappId} from '../config';

export function login() {
    loadTapp(loginTappId);
}

export function logout() {
    setAccessToken('');
    closeWindow();
    location.reload();
}