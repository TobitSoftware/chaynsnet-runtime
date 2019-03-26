import SYSTEM_URL_PARAMETERS from '../constants/system-url-parameter';

const parameterRegex = name => new RegExp(`&?${name}=?[^&]*`, 'i');

const getUrlParameterCache = {
    href: '',
    urlParameter: {},
    urlParameterNoSystem: {},
};

export function getUrlParameters(withSystemParameter = true) {
    if (getUrlParameterCache.href !== window.location.href) {
        getUrlParameterCache.href = window.location.href;
        getUrlParameterCache.urlParameterNoSystem = {};
        getUrlParameterCache.urlParameter = {};

        const urlParams = window.location.href.split('?').length > 1 ? window.location.href.split('?')[1].split('&') : false;

        if (urlParams) {
            for (let param of urlParams) {
                param = param.split('=');
                const key = param[0].toLowerCase();
                const value = param[1];

                getUrlParameterCache.urlParameter[key] = value;
                if (SYSTEM_URL_PARAMETERS.indexOf(key) === -1) {
                    getUrlParameterCache.urlParameterNoSystem[key] = value;
                }
            }
        }
    }

    return withSystemParameter ? { ...getUrlParameterCache.urlParameter } : { ...getUrlParameterCache.urlParameterNoSystem };
}

export function set(name, value) {
    const regex = parameterRegex(name);
    const match = window.location.href.match(regex);

    let nextUrl = window.location.href;


    if (match) {
        nextUrl = nextUrl.replace(regex, `${match[1] === '&' ? '' : '&'}${name}${value ? `=${value}` : ''}`);
    } else {
        nextUrl += `${window.location.href.indexOf('?') > -1 ? '&' : '?'}${name}${value ? `=${value}` : ''}`;
    }

    window.history.replaceState({}, document.title, nextUrl);
}

export function remove(name) {
    const regex = parameterRegex(name);

    if (window.location.href.match(regex)) {
        window.history.replaceState({}, document.title, window.location.href.replace(regex, ''));
    }
}
