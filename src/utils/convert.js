import { chaynsInfo } from '../chayns-info';

export function argbHexToRgba(hex) {
    let result;

    if (typeof (hex) === 'string' && typeof (hex) === 'undefined') {
        if (hex.indexOf('#') === -1) {
            hex = `#${hex}`;
        }
    }

    if (hex) {
        if (hex.length === 9) {
            result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
            return result ? {
                    r: parseInt(result[2], 16),
                    g: parseInt(result[3], 16),
                    b: parseInt(result[4], 16),
                    a: Math.round(parseInt(result[1], 16) / 255 * 100) / 100
                } : null;
        }
        result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
                r: parseInt(result[1], 16),
                g: parseInt(result[2], 16),
                b: parseInt(result[3], 16),
                a: 1
            } : null;
    }

    return null;
}

export function numberToTimeString(number) {
    number = parseInt(number, 10);
    return number >= 0 && number < 10 ? `0${number}` : number.toString();
}

export function utf8Decode(utftext) {
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
        const spl = tobitAccessToken.split('.');
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

export function getRelativeColor(baseColor, percentage, opacity) {
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
        baseColor = chaynsInfo.ColorScheme.BaseColor;
    }

    if (percentage < 0 || percentage === undefined) {
        //noinspection Eslint
        throw {
            name: 'OutOfRangeException',
            message: 'Percentage has at least to be 0'
        };
    }

    if (percentage === 100 && !opacity) {
        return baseColor;
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
    if (opacity) {
        return `rgba(${parseInt(getSingleRelativeColor(r, percentage), 16)},${parseInt(getSingleRelativeColor(g, percentage), 16)},${parseInt(getSingleRelativeColor(b, percentage), 16)},${opacity})`
    }

    color = '#';
    color += getSingleRelativeColor(r, percentage);
    color += getSingleRelativeColor(g, percentage);
    color += getSingleRelativeColor(b, percentage);
    return color;
}

/**
 * converts urlParameter string to object
 * @param {string} parameterString, e.g. '?test=1&second=hello'
 * @returns {{}} e.g. {param1: 'param1Value', param2: 'param2Value'}
 */
export function parameterStringToObject(parameterString) {
    let result = {};

    if (parameterString.indexOf('?') > -1) {
        parameterString = parameterString.split('?')[1];
    }

    for (let param of parameterString.split('&')) {
        let parsed = param.split('=');
        if (parsed.length > 1 && parsed[1].length > 0) {
            result[parsed[0]] = parsed[1];
        }
    }

    return result;
}

let monthNames = ["Januar", "Februar", "März", "April", "Mai", "Juni", "Juli", "August", "September", "Oktober", "November", "Dezember"];
let dayNames = ["Sonntag", "Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag", "Samstag"];

export function dateToString(date) {
    if (typeof date === 'number') {
        date = new Date(date)
    }

    if (!date.getTime) {
        return null;
    }

    return `${dayNames[date.getDay()]}, ${date.getDate()}. ${monthNames[date.getMonth()]}`;
}

export function numberToMonthName(number) {
    number = parseInt(number, 10);
    return (number >= 0 && number < monthNames.length) ? monthNames[number] : null;
}
export function numberToDayName(number, length = null) {
    number = parseInt(number, 10);
    return (number >= 0 && number < dayNames.length) ? (length) ? dayNames[number].substr(0, length) : dayNames[number] : null;
}