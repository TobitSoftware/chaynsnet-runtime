import { showLogin, logout, login } from '../../login';

export function tobitWebTokenLogin(req, res) {
    if (req.value && 'tobitAccessToken' in req.value) {
        login(req.value.tobitAccessToken);
    }
}

export function tobitLogin(req, res) {
    showLogin();
}

export function tobitLogout(req, res) {
    logout();
}
