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

/**
 * Convert Object to CSS style String.
 *
 *   Example:
 *      {
 *          height: "20px",
 *          width: {
 *              "20px": false,
 *              "30px": true,
 *              "40px": true
 *          }
 *      }
 *      returns: ' "height:20px;width:30px;" '
 *
 * @param styles
 * @returns {string}
 */
export function styleNames(styles) {
    let styleNames = '';

    for (let key of Object.keys(styles)) {
        if (typeof styles[key] === "string") {
            styleNames += `${key}:${styles[key]};`;
            continue;
        }

        if (typeof styles[key] !== "object" || styles[key].length === 0) {
            continue;
        }

        let conditions = styles[key];

        for (let value of Object.keys(conditions)) {
            if (conditions[value]) {
                styleNames += `${key}:${value};`;
                break;
            }
        }
    }

    return `"${styleNames}"`;
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

