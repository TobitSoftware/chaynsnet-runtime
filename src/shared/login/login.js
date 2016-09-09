import Facebook from './facebook';
import {emailLogin, facebookLogin} from './chayns-login';
import {decodeTobitAccessToken} from '../utils/convert';
import {stringisEmptyOrWhitespace} from '../utils/helper';
import Dialog from '../dialog';
import Textstrings from '../utils/textstings';

let $dom,
    facebook;

export default class Login {
    static run() {
        return new Promise((resolve) => {
            let tobitAccessToken = document.parentWindow.external.GetKeyValue("TobitAccessToken");
            console.log('tobitAccessToken', tobitAccessToken);
            var tokenData = decodeTobitAccessToken(tobitAccessToken);
            if (!stringisEmptyOrWhitespace(tobitAccessToken) && new Date(tokenData.exp) > new Date() && tokenData.LocationID === window.ChaynsInfo.LocationID) {
                resolve(tobitAccessToken);
                return;
            }

            $dom = {
                email: document.querySelector('.view__login .email'),
                password: document.querySelector('.view__login .password'),
                next: document.querySelector('.view__login .login')
            };

            facebook = new Facebook();
            facebook.logout();
            $dom.email.addEventListener('input', validateInput);
            $dom.password.addEventListener('input', validateInput);

            $dom.next.addEventListener('click', () => {
                if (!validateInput())
                    return;
                emailLogin($dom.email.value, $dom.password.value).then((res) => {
                    if (res.success) {
                        document.parentWindow.external.PutKeyValue("TobitAccessToken", res.tobitAccessToken);
                        hide();
                        resolve(res.tobitAccessToken);
                    } else {

                        Dialog.show('alert', {message: Textstrings.get.login.loginfailed});
                    }
                });
            });

            //Facebook Login
            document.querySelector('.facebookConnect__button').addEventListener('click', () => {
                facebook.login().then((facebookAccessToken) => {
                    if (facebookAccessToken) {
                        facebookLogin(facebookAccessToken).then((res) => {
                            if (res.success) {
                                document.parentWindow.external.PutKeyValue("TobitAccessToken", res.tobitAccessToken);
                                hide();
                                resolve(res.tobitAccessToken);
                            }
                            else {
                                Dialog.show('alert', {message: Textstrings.get.login.loginfailed});
                            }
                        });
                    }
                });
            });
            show();
        });
    }
}

function show() {
    document.querySelector('#BodyContent').classList.add('hidden');
    document.querySelector('.view__login').classList.remove('hidden');
}

function hide() {
    document.querySelector('.view__login').classList.add('hidden');
    document.querySelector('#BodyContent').classList.remove('hidden');
}

function validateInput() {
    if ($dom.email.value.trim().length > 0 && $dom.password.value.trim().length > 0) {
        $dom.next.classList.remove('button--disabled');
        return true;
    } else {
        $dom.next.classList.add('button--disabled');
        return false;
    }
}

window.logout = () => {
    document.parentWindow.external.PutKeyValue("TobitAccessToken", '');
    location.reload();
};
