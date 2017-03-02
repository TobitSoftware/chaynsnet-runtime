import { getUrlParameters } from './helper';
import { loadTapp } from '../tapp/custom-tapp';

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

            } else if ($icons[i].getAttribute('data-url')) {
                let url = $icons[i].getAttribute('data-url');
                url += `${url.indexOf('?') > -1 ? '&' : '?'}${urlParameters}`;
                cb = () => location.href = url;

                if (getUrlParameters().debug !== '1') {
                    $icons[i].classList.add('hidden');
                }
            }

            $icons[i].addEventListener('click', cb);
        }
        if (getUrlParameters().navigation === '1' || getUrlParameters().debug === '1') {
            Navigation.show();
        }
    }

    static show(debug = false) {
        if (debug) {
            for (let element of $navigation.querySelectorAll('.navigation__element')) {
                element.classList.remove('hidden');
            }
        }
        $navigation.classList.remove('hidden');
    }

    static hide() {
        $navigation.classList.add('hidden');
    }
}