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