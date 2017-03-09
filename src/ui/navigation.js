import htmlToElement from 'html-to-element';
import { getUrlParameters } from '../utils/helper';
import { loadTapp } from '../tapp/custom-tapp';
import NAVIGATION_ITEMS from '../constants/navigation-items';

let $navigation = null;

export default class Navigation {
    static init() {
        if (getUrlParameters().navigation === '1') {
            Navigation.show();
        }
    }

    static show() {
        if (!$navigation) {
            $navigation = getNavigationElement();
            document.body.appendChild($navigation);
        }
        $navigation.classList.remove('hidden');
    }

    static hide() {
        $navigation.classList.add('hidden');
    }
}


function getNavigationElement() {
    const $navigation = htmlToElement('<div class="navigation hidden"><ul></ul></div>');

    NAVIGATION_ITEMS.forEach((item) => {
        const $navItem = htmlToElement(`<li class="navigation__element">
                                           <span class="ChaynsIdIcon fa ${item.icon}"></span>
                                       </li>`);

        $navItem.addEventListener('click', () => loadTapp(item.tappId));

        $navigation.firstChild.appendChild($navItem);
    });

    return $navigation;
}