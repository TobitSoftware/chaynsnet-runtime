export function getRelativeColor(baseColor, percentage) {
    function getSingleRelativeColor(hex, percentage) {
        if (hex.length === 1) {
            hex += hex;
        }

        let dec = parseInt(hex, 16);
        dec = (255 - dec) * percentage / 100;
        dec = dec >= 255 ? 0 : Math.floor(255 - dec);
        dec = dec.toString(16).toUpperCase();

        if (dec.length === 1) {
            dec += dec;
        }

        return dec;
    }

    if (typeof baseColor === 'number') {
        percentage = baseColor;
        baseColor = window.ChaynsInfo.ColorScheme.BaseColor;
    }

    if (percentage < 0 || percentage === undefined) {
        //noinspection Eslint
        throw {
            name: 'OutOfRangeException',
            message: 'Percentage has at least to be 0'
        };
    }

    let color = baseColor.substr(1);
    let l = color.length;

    let r, g, b;
    if (l === 3) {
        r = color.substring(0, 1);
        g = color.substring(1, 2);
        b = color.substring(2, 3);
    } else if (l === 6) {
        r = color.substring(0, 2);
        g = color.substring(2, 4);
        b = color.substring(4, 6);
    } else {
        //noinspection Eslint
        throw {
            name: 'WrongFormatException',
            message: 'Invalid color-format'
        };
    }
    color = '#';
    color += getSingleRelativeColor(r, percentage);
    color += getSingleRelativeColor(g, percentage);
    color += getSingleRelativeColor(b, percentage);
    return color;
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

//noinspection JSUnusedGlobalSymbols
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

function utf8Decode(utftext) {
    let string = '';
    let i = 0;
    let c, c1, c2;

    while (i < utftext.length) {

        c = utftext.charCodeAt(i);

        if (c < 128) {
            string += String.fromCharCode(c);
            i++;
        } else if ((c > 191) && (c < 224)) {
            c1 = utftext.charCodeAt(i + 1);
            string += String.fromCharCode(((c & 31) << 6) | (c1 & 63));
            i += 2;
        } else {
            c1 = utftext.charCodeAt(i + 1);
            c2 = utftext.charCodeAt(i + 2);
            string += String.fromCharCode(((c & 15) << 12) | ((c1 & 63) << 6) | (c2 & 63));
            i += 3;
        }
    }
    return string;
}

export function decodeTobitAccessToken(tobitAccessToken) {
    if (tobitAccessToken && typeof (tobitAccessToken) === 'string' && tobitAccessToken.length > 0) {
        var spl = tobitAccessToken.split('.');
        if (spl.length === 3) {
            try {
                spl[1] = spl[1].slice(0, spl[1].length + (spl[1].length % 4));
                spl[1] = spl[1].replace(/-/g, '+').replace(/_/g, '/');

                return JSON.parse(utf8Decode(atob(spl[1])));
            } catch (e) {
                //TODO Logging
            }
        }
    }
    return null;
}