import logger from 'chayns-logger';
import FloatingButton from '../ui/floating-button';
import WaitCursor from '../ui/wait-cursor';
import { setSelectedTapp } from '../chaynsInfo';
import { getUrlParameters } from '../utils/helper';
import { parameterStringToObject, htmlToElement } from '../utils/convert';

let $bodyContent = document.querySelector('.body-content');

export function loadTapp(tappId) {
    FloatingButton.hide();
    WaitCursor.hide();

    let tapp = getTappById(tappId);
    if (tapp) {
        setSelectedTapp(tapp);
        _loadTapp(parseInt(tapp.id, 10), setUrlParams(tapp.url));
    } else {
        logger.warning({
            message: 'no tapp found',
            data: { tappId },
            fileName: 'customTapp.js',
            section: 'loadTapp'
        });
        console.warn('No Tapp found!');
    }
}

/**
 * Returns the tapp to tappId
 * @param tappId
 * @returns {*}
 */
function getTappById(tappId) {
    for (let tapp of window.ChaynsInfo.Tapps) {
        if (tapp.id === parseInt(tappId, 10)) {
            return tapp;
        }
    }
    return null;
}

/**
 * replaces url parameters with chayns env, removes double params, removes empty params, adds non system urlParameter from CWL
 * @param {string} url
 * @returns {string} url
 */
function setUrlParams(url) {
    url = url.replace(/##apname##/ig, window.ChaynsInfo.LocationName);
    url = url.replace(/##siteid##/ig, window.ChaynsInfo.SiteID);
    url = url.replace(/##os##/ig, 'webshadowlight');
    url = url.replace(/##version##/ig, window.ChaynsInfo.Version);
    url = url.replace(/##colormode##/ig, window.ChaynsInfo.ColorMode.toString());
    url = url.replace(/##color##/ig, window.ChaynsInfo.Color.replace('#', ''));
    url = url.replace(/##adminmode##/ig, (window.ChaynsInfo.AdminMode ? 1 : 0).toString());
    url = url.replace(/##tobituserid##/ig, window.ChaynsInfo.User.ID.toString());

    if (window.ChaynsInfo.User !== undefined && window.ChaynsInfo.User.ID !== '' && window.ChaynsInfo.User.ID > 0) {
        url = url.replace(/##firstname##/ig, window.ChaynsInfo.User.FirstName);
        url = url.replace(/##lastname##/ig, window.ChaynsInfo.User.LastName);
    }

    url = url.replace(/##.*?##/g, ''); // removes unused parameters

    let urlParam = Object.assign(getUrlParameters(false), parameterStringToObject(url));

    let paramString = Object.keys(urlParam).map((key) => `${key}=${urlParam[key]}`);
    let timeStamp = url.match(/(?:_=)\b(\d*)/i);

    return `${url.split('?')[0]}?${paramString.join('&')}${(!timeStamp) ? `&_=${Date.now()}` : ''}`;
}

/**
 * loads an url by tapp id and creates the iframe
 * @param {number} tappId
 * @param {string} tappUrl
 */
function _loadTapp(tappId, tappUrl) {
    if (typeof tappId != 'number') {
        tappId = parseInt(tappId, 10);
        if (Number.isNaN(tappId)) {
            console.error('TappId is not a number');
            return;
        }
    }
    if (!tappUrl || typeof tappUrl != 'string') {
        console.error('TappUrl is not a string');
        return;
    }

    let $input = htmlToElement(`<input id="ActiveTappID" name="ActiveTappID" type="hidden" value="${tappId}">`);

    let $form = htmlToElement(`<form action="${tappUrl}" target="TappIframe" method="get" id="TobitAccessTokenForm"></form>`);

    let parameter = parameterStringToObject(tappUrl);
    for (let key of Object.keys(parameter)) {
        $form.appendChild(htmlToElement(`<input name="${key}" value="${parameter[key]}" type="hidden">`))
    }

    let $iframe = htmlToElement('<iframe frameborder="0" marginheight="0" marginwidth="0" id="TappIframe" name="TappIframe"></iframe>');
    $iframe.style.height = `${window.innerHeight - document.body.getBoundingClientRect().top + document.body.scrollTop}px`;

    if (window.ChaynsInfo.IsMobile) {
        $iframe.setAttribute('style', 'margin-top: -10px !important;');
    }

    if (window.ChaynsInfo.ExclusiveMode) {
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