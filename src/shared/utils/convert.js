/**
 * convert string to node
 * @param html
 * @returns {*|Node}
 */
export function htmlToElement(html) {
    const template = document.createElement('div');
    template.innerHTML = html.trim();
    return template.firstChild;
}

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