import { getUrlParameters } from './helper';
import { loadTapp } from '../tapp/custom-tapp';

let $navigation = document.querySelector('.navigation');

export default class Navigation {
    static init() {
        let $icons = $navigation.querySelectorAll('.navigation__element');

        for (let i = 0, l = $icons.length; i < l; i++) {
            if ($icons[i].getAttribute('data-tappid')) {
                $icons[i].addEventListener('click', () => loadTapp($icons[i].getAttribute('data-tappid')));
            }
        }

        if (getUrlParameters().navigation === '1') {
            Navigation.show();
        }
    }

    static show() {
        $navigation.classList.remove('hidden');
    }

    static hide() {
        $navigation.classList.add('hidden');
    }
}