import {getUrlParameters} from './helper';
import {loadTapp} from "../../web/customTapp";

let $navigation = document.querySelector('.navigation');

export default class Navigation {
    static init() {
        let $icons = $navigation.querySelectorAll('.navigation__element');
        let urlParameters = (location.href.split('?').length > 1) ? location.href.split('?')[1] : '';

        for (let i = 0, l = $icons.length; i < l; i++) {
            let cb = () => {
            };

            if ($icons[i].getAttribute('data-tappid')) {

                cb = () => loadTapp($icons[i].getAttribute('data-tappid'));

            } else if ($icons[i].getAttribute('data-url') && getUrlParameters().debug === '1') {
                let url = $icons[i].getAttribute('data-url');
                url += `${url.indexOf('?') > -1 ? '&' : '?'}${urlParameters}`;
                cb = () => location.href = url;
            } else {
                $icons[i].classList.add('hidden');
                continue;
            }
            $icons[i].addEventListener('click', cb);
        }
        if (getUrlParameters().navigation === '1' || getUrlParameters().debug === '1') {
            Navigation.show();
        }
    }

    static show(debug = false) {
        if (debug) {
            $navigation.querySelectorAll('.navigation__element').forEach(element => element.classList.remove('hidden'));
        }
        $navigation.classList.remove('hidden');
    }

    static hide() {
        $navigation.classList.add('hidden');
    }
}