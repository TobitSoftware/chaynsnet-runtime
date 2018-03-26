import { chaynsInfo } from '../chayns-info';
import SYSTEM_URL_PARAMETERS from '../constants/system-url-parameter';
import { decodeTobitAccessToken } from './convert';

/**
 * Function that do the same as query's "$(el).outerHeight(true)"
 * @param el
 * @returns {number}
 */
export function outerHeight(el) {
    let height = el.offsetHeight;
    const style = getComputedStyle(el);

    height += parseInt(style.marginTop) + parseInt(style.marginBottom);
    return height;
}

export function setCookie(cName, value, exdays) {
    const exdate = new Date();
    exdate.setDate(exdate.getDate() + exdays);
    const cValue = escape(value) + ((exdays === null) ? '' : `; expires=${exdate.toUTCString()}`);
    document.cookie = `${cName}=${cValue}`;
}

export function getCookie(cCame) {
    let i,
        x,
        y,
        ARRcookies = document.cookie.split(';');
    for (i = 0; i < ARRcookies.length; i++) {
        x = ARRcookies[i].substr(0, ARRcookies[i].indexOf('='));
        y = ARRcookies[i].substr(ARRcookies[i].indexOf('=') + 1);
        x = x.replace(/^\s+|\s+$/g, '');
        if (x === cCame) {
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

/**
 * scrolls to position
 * @param to
 * @param duration
 * @param callback
 */
export function scrollTo(to, duration, callback) {
    if (duration <= 0) {
        document.documentElement.scrollTop = to;
        document.body.parentNode.scrollTop = to;
        document.body.scrollTop = to;
        return;
    }

    const start = document.documentElement.scrollTop || document.body.parentNode.scrollTop || document.body.scrollTop;
    const change = to - start;
    const increment = 20;
    let currentTime = 0;

    duration = (typeof(duration) === 'undefined') ? 500 : duration;

    const animateScroll = () => {
        currentTime += increment;

        const val = ((t, b, c, d) => {
            t /= d / 2;
            if (t < 1) {
                return c / 2 * t * t + b
            }
            t--;
            return -c / 2 * (t * (t - 2) - 1) + b;
        })(currentTime, start, change, duration);

        //TODO: add support for external easing functions

        document.documentElement.scrollTop = val;
        document.body.parentNode.scrollTop = val;
        document.body.scrollTop = val;

        if (currentTime < duration) {
            (window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || function (callback) {
                window.setTimeout(callback, 1000 / 60);
            })(animateScroll);
        } else if (callback && typeof(callback) === 'function') {
            callback();
        }
    };

    animateScroll();
}

export function stringisEmptyOrWhitespace(value) {
    return value == null || value.trim().length < 1;
}

export function validateTobitAccessToken(tobitAccessToken) {
    const tokenData = decodeTobitAccessToken(tobitAccessToken);
    return tokenData && new Date(tokenData.exp) > new Date() && (!chaynsInfo || tokenData.LocationID == chaynsInfo.LocationID);
}

let urlParameter = null;
let urlParameterNoSystem = null;

export function getUrlParameters(withSystemParameter = true) {
    if (!urlParameter || !urlParameterNoSystem) {
        urlParameterNoSystem = {};
        urlParameter = {};

        const urlParams = window.location.href.split('?').length > 1 ? window.location.href.split('?')[1].split('&') : false;

        if (urlParams) {
            for (let param of urlParams) {
                param = param.split('=');
                const key = param[0].toLowerCase();
                const value = param[1];

                urlParameter[key] = value;
                if (SYSTEM_URL_PARAMETERS.indexOf(key) === -1) {
                    urlParameterNoSystem[key] = value;
                }
            }
        }
    }

    return withSystemParameter ? { ...urlParameter } : { ...urlParameterNoSystem };
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
    const dateEquals = date1.getDate() === date2.getDate() && date1.getMonth() === date2.getMonth() && date1.getFullYear() === date2.getFullYear();

    return (!withTime) ? dateEquals : dateEquals && date1.getHours() === date2.getHours() && date1.getMinutes() === date2.getMinutes() && date1.getSeconds() === date2.getSeconds();
}
