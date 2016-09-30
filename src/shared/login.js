import {loadTapp} from '../web/customTapp';
import {setAccessToken, closeWindow} from './utils/native-functions';

export let loginTappId = -1;

export function login() {
    loadTapp(loginTappId);
}

export function logout() {
    setAccessToken('');
    closeWindow();
    location.reload();
}