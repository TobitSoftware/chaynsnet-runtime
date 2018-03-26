import logger from 'chayns-logger';
import htmlToElement from 'html-to-element';
import { chaynsInfo, setSelectedTapp } from '../chayns-info';
import FloatingButton from '../ui/floating-button';
import WaitCursor from '../ui/wait-cursor';
import { getUrlParameters } from '../utils/url-parameter';
import { parameterStringToObject } from '../utils/convert';
import ConsoleLogger from '../utils/console-logger';

const loggerLoadTappById = new ConsoleLogger('loadTappById(custom-tapp.js)');
const loggerLoadTapp = new ConsoleLogger('loadTapp(custom-tapp.js)');

const $bodyContent = document.querySelector('.body-content');

/**
 * Loads Tapp by TappId.
 * @param {Number} tappId
 */
export default function loadTappById(tappId) {
    FloatingButton.hide();
    WaitCursor.hide();

    const tapp = getTappById(tappId);
    if (tapp) {
        setSelectedTapp(tapp);
        loadTapp(tapp.id, setUrlParams(tapp.url));
    } else {
        logger.warning({
            message: 'no tapp found',
            customNumber: tappId,
            fileName: 'custom-tapp.js',
            section: 'loadTapp'
        });
        loggerLoadTappById.warn('No Tapp found!');
    }
}

/**
 * Returns the tapp to tappId
 * @param tappId
 * @returns {*}
 */
export function getTappById(tappId) {
    return chaynsInfo.Tapps.find(tapp => tapp.id === tappId) || null;
}

/**
 * replaces url parameters with chayns env, removes double params, removes empty params, adds non system urlParameter from cnrt
 * @param {string} url
 * @returns {string} url
 */
function setUrlParams(url) {
    url = url.replace(/##apname##/ig, chaynsInfo.LocationName);
    url = url.replace(/##siteid##/ig, chaynsInfo.SiteID);
    url = url.replace(/##os##/ig, 'webshadowlight');
    url = url.replace(/##version##/ig, chaynsInfo.getGlobalData().AppInfo.Version);
    url = url.replace(/##colormode##/ig, chaynsInfo.ColorMode.toString());
    url = url.replace(/##color##/ig, chaynsInfo.Color.replace('#', ''));
    url = url.replace(/##adminmode##/ig, (chaynsInfo.AdminMode ? 1 : 0).toString());
    url = url.replace(/##tobituserid##/ig, chaynsInfo.User.ID.toString());

    if (chaynsInfo.User !== undefined && chaynsInfo.User.ID !== '' && chaynsInfo.User.ID > 0) {
        url = url.replace(/##firstname##/ig, chaynsInfo.User.FirstName);
        url = url.replace(/##lastname##/ig, chaynsInfo.User.LastName);
    }

    url = url.replace(/##.*?##/g, ''); // removes unused parameters

    const urlParam = Object.assign(getUrlParameters(false), parameterStringToObject(url));

    const paramString = Object.keys(urlParam).map(key => `${key}=${urlParam[key]}`);
    const timeStamp = url.match(/(?:_=)\b(\d*)/i);

    return `${url.split('?')[0]}?${paramString.join('&')}${(!timeStamp) ? `&_=${Date.now()}` : ''}`;
}

/**
 * loads an url by tapp id and creates the iframe
 * @param {number} tappId
 * @param {string} tappUrl
 */
function loadTapp(tappId, tappUrl) {
    if (typeof tappId !== 'number') {
        tappId = parseInt(tappId, 10);
        if (Number.isNaN(tappId)) {
            loggerLoadTapp.error('TappId is not a number');
            return;
        }
    }
    if (!tappUrl || typeof tappUrl !== 'string') {
        loggerLoadTapp.error('TappUrl is not a string');
        return;
    }

    const $input = htmlToElement(`<input id="ActiveTappID" name="ActiveTappID" type="hidden" value="${tappId}">`);

    const $form = htmlToElement(`<form action="${tappUrl}" target="TappIframe" method="get" id="TobitAccessTokenForm"></form>`);

    const parameter = parameterStringToObject(tappUrl);
    for (const key of Object.keys(parameter)) {
        $form.appendChild(htmlToElement(`<input name="${key}" value="${parameter[key]}" type="hidden">`));
    }

    const $iframe = htmlToElement('<iframe frameborder="0" marginheight="0" marginwidth="0" id="TappIframe" name="TappIframe"></iframe>');
    $iframe.style.height = `${window.innerHeight - document.body.getBoundingClientRect().top + document.body.scrollTop}px`;

    if (chaynsInfo.IsMobile) {
        $iframe.setAttribute('style', 'margin-top: -10px !important;');
    }

    if (chaynsInfo.ExclusiveMode) {
        $bodyContent.classList.add('body-content--exclusive-view');
    } else {
        $bodyContent.classList.remove('body-content--exclusive-view');
    }


    $bodyContent.innerHTML = '';
    $bodyContent.appendChild($input);
    $bodyContent.appendChild($form);
    $bodyContent.appendChild($iframe);


    if ($form.length > 0) {
        $form.submit();
    }
}
