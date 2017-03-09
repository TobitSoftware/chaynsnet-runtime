import { chaynsInfo } from '../chaynsInfo';
import { SYSTEM_URL_PARAMETERS } from '../constants/config';
import { decodeTobitAccessToken } from './convert';

/**
 * Function that do the same as query's "$(el).outerHeight(true)"
 * @param el
 * @returns {number}
 */
export function outerHeight(el) {
    let height = el.offsetHeight;
    let style = getComputedStyle(el);

    height += parseInt(style.marginTop) + parseInt(style.marginBottom);
    return height;
}

export function setCookie(cName, value, exdays) {
    let exdate = new Date();
    exdate.setDate(exdate.getDate() + exdays);
    //noinspection JSDeprecatedSymbols
    let cValue = escape(value) + ((exdays === null) ? '' : '; expires=' + exdate.toUTCString());
    document.cookie = `${cName}=${cValue}`;
}

export function getCookie(cCame) {
    let i, x, y, ARRcookies = document.cookie.split(';');
    for (i = 0; i < ARRcookies.length; i++) {
        x = ARRcookies[i].substr(0, ARRcookies[i].indexOf('='));
        y = ARRcookies[i].substr(ARRcookies[i].indexOf('=') + 1);
        x = x.replace(/^\s+|\s+$/g, '');
        if (x === cCame) {
            //noinspection JSDeprecatedSymbols
            return unescape(y);
        }
    }
    return null;
}

export function getWindowMetrics() {
    return {
        AvailHeight: window.innerHeight - 10,
        WindowScrollTop: document.body.scrollTop,
        WindowInnerHeight: window.innerHeight,
        pageYOffset: window.pageYOffset
    };
}

export function ApplyUnsafeFunction(func, args, thisArg) {
    if (typeof func !== 'function') {
        return;
    }

    if (!(args instanceof Array)) {
        thisArg = args;
        args = undefined;
    }

    if (!thisArg) {
        thisArg = window;
    }

    try {
        func.apply(thisArg, args);
    } catch (exception) {
        window.ChaynsWeb.log(exception);
    }
}

export function stringisEmptyOrWhitespace(value) {
    return value == null || value.trim().length < 1;
}

export function validateTobitAccessToken(tobitAccessToken) {
    let tokenData = decodeTobitAccessToken(tobitAccessToken);
    return tokenData && new Date(tokenData.exp) > new Date() && (!chaynsInfo || tokenData.LocationID == chaynsInfo.LocationID);
}

let urlParameter = null,
    urlParameterNoSystem = null;
export function getUrlParameters(withSystemParameter = true) {
    if (!urlParameter || !urlParameterNoSystem) {
        urlParameterNoSystem = {};
        urlParameter = {};

        let urlParams = window.location.href.split('?').length > 1 ? window.location.href.split('?')[1].split('&') : false;

        if (urlParams) {
            for (let param of urlParams) {
                param = param.split('=');
                urlParameter[param[0].toLowerCase()] = param[1];
                if (SYSTEM_URL_PARAMETERS.indexOf(param[0]) === -1) {
                    urlParameterNoSystem[param[0].toLowerCase()] = param[1];
                }
            }
        }
    }

    return withSystemParameter ? urlParameter : urlParameterNoSystem;
}

/**
 * shortcut for querySelector.
 *    select from document like: _('selector')
 *    from other elements like: _('selector', element)
 * @param selector
 * @param element
 * @returns {Element}
 * @private
 */
export function _(selector, element = document) {
    return element.querySelector(selector);
}

/**
 * Compares date1 with date2. Compares Year, Month, Day & if withTime is true also hours, minutes, seconds.
 * @param date1
 * @param date2
 * @param withTime
 * @returns {boolean}
 */
export function compareDate(date1, date2, withTime = false) {
    let dateEquals = date1.getDate() === date2.getDate() && date1.getMonth() === date2.getMonth() && date1.getFullYear() === date2.getFullYear();

    return (!withTime) ? dateEquals : dateEquals && date1.getHours() === date2.getHours() && date1.getMinutes() === date2.getMinutes() && date1.getSeconds() === date2.getSeconds();
}