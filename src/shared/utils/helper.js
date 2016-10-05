import {decodeTobitAccessToken} from './convert';

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
    let $body = document.querySelector('body');
    let headerHeight = 0,
        contentMarginTop = 0,
        contentMarginBottom = 0,
        scrollHeight = $body.scrollTop - headerHeight - contentMarginTop;

    if (scrollHeight < 0) {
        scrollHeight = 0;
    }

    let availHeight = window.innerHeight - headerHeight - contentMarginTop - contentMarginBottom,
        minAvailHeight = window.innerHeight - headerHeight - contentMarginTop - contentMarginBottom;

    if (availHeight < minAvailHeight) {
        availHeight = minAvailHeight;
    }

    return {
        AvailHeight: availHeight,
        WindowScrollTop: scrollHeight,
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
    return tokenData && new Date(tokenData.exp) > new Date() && tokenData.LocationID == window.ChaynsInfo.LocationID
}

let urlParameter = null,
    urlParameterNoSystem = null,
    systemParameter = ['tappid', 'locationid', 'console', 'debug'];
export function getUrlParameters(withSystemParameter = true) {
    if (!urlParameter || !urlParameterNoSystem) {
        urlParameterNoSystem = urlParameter = {};

        let urlParams = window.location.href.split('?').length > 1 ? window.location.href.split('?')[1].split('&') : false;

        if (urlParams) {
            for (let param of urlParams) {
                param = param.split('=');
                urlParameter[param[0].toLowerCase()] = param[1];
                if (systemParameter.indexOf(param[0]) === -1) {
                    urlParameterNoSystem[param[0].toLowerCase()] = param[1];
                }
            }
        }
    }

    return withSystemParameter ? urlParameter : urlParameterNoSystem;
}