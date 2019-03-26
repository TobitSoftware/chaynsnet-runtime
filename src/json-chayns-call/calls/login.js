/* eslint-disable no-unused-vars */
import { showLogin, logout, login } from '../../login';

export function setTobitAccessToken(req, res) {
    if (req.value && 'tobitAccessToken' in req.value) {
        login(req.value.tobitAccessToken);
        res.answer();
    }
}

export function tobitLogin(req, res) {
    showLogin();
}

export function tobitLogout(req, res) {
    logout();
}
