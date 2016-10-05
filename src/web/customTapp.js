import FloatingButton from '../shared/floating-button';
import WaitCursor from '../shared/wait-cursor';
import {setSelectedTapp} from './chaynsInfo';
import {getUrlParameters} from "../shared/utils/helper";

export function loadTapp(tappId) {
    FloatingButton.hide();
    WaitCursor.hide();

    let tapp = getTappById(tappId);
    if (tapp) {
        setSelectedTapp(tapp);
        loadUrlByTappId(parseInt(tapp.id, 10), replaceUrlParams(tapp.url, tapp.id));
    } else {
        throw 'No Tapp found!';
    }
}

/**
 * Returns the tapp to tappId
 * @param tappId
 * @returns {*}
 */
function getTappById(tappId) {
    for (let tapp of window.ChaynsInfo.Tapps) {
        if (tapp.id == parseInt(tappId, 10)) {
            return tapp;
        }
    }
    return null;
}

/**
 * loads content to iframe
 */
function loadToIframe() {
    let iframe = document.querySelector('#CustomTappIframe');
    let $TobitAccessTokenForm = document.querySelector('#TobitAccessTokenForm');

    if ($TobitAccessTokenForm.length > 0) {
        $TobitAccessTokenForm.submit();
    }

    let iframeHeight = window.innerHeight - document.body.getBoundingClientRect().top + document.body.scrollTop;
    iframe.style.height = `${iframeHeight}px`;
}

/**
 * replaces url parameters with chayns env, removes double params, removes empty params
 * @param {string} url
 * @param {number} tappId
 * @returns {string}
 */
function replaceUrlParams(url, tappId) {
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

    let urlParams = [];
    let tempParams = getParametersArrayByString(url);
    let facebookAuth = false;

    for (let i = 0; i < tempParams.length; i++) {
        if (tempParams[i].value !== '') {
            let found = false;

            for (let n = 0, nl = urlParams.length; n < nl; n++) {
                if (tempParams[i].name.toLowerCase() === urlParams[n].name.toLowerCase()) {
                    found = true;
                }
            }

            if (tempParams[i].name === 'facebook-auth') {
                facebookAuth = true;
            }

            if (!found && tempParams[i].name !== 'facebook-auth') {
                urlParams.push(tempParams[i]);
            }
        }
    }

    url = appendCustomParameters(url.split('?')[0], urlParams);

    if (facebookAuth) {
        url += '&facebook-auth';
    }

    // let urlTappId = url.match(/(?:tappid=)\b(\d*)/i);
    // if (!urlTappId && tappId) {
    //     url += `&TappID=${tappId}`;
    // }

    let timeStamp = url.match(/(?:_=)\b(\d*)/i);
    if (!timeStamp) {
        url += `&_=${Date.now()}`;
    }

    return url;
}

/**
 * accepts string of url parameters, returns array with parameter objects
 * @param {string} parameterString, e.g. '?test=1&second=hello'
 * @returns {Array} array of parameter objects, e.g. [{name: test, value: 1}, {name: second, value: 'hello'}]
 */
function getParametersArrayByString(parameterString) {
    let result = [];

    let workingString = '';

    if (parameterString.indexOf('?') > -1) {
        workingString = parameterString.split('?')[1];
    } else {
        workingString = parameterString;
    }

    let params = workingString.split('&');

    params.forEach(function (paramString) {
        result.push({
            name: paramString.split('=')[0],
            value: paramString.split('=')[1]
        });
    });

    return result;
}

/**
 * accepts url parameter array, returns array with parameter objects
 * @param {Array} parameterArray
 * @returns {Array}
 */
function getParametersArrayByArray(parameterArray) {
    let result = [];

    for (let i = 0, l = parameterArray.length; i < l; i++) {
        result.push.apply(result, getParametersArrayByString(parameterArray[i]));
    }

    return result;
}

/**
 * accepts url and parameters array, returns url including parameters
 * @param {string} url
 * @param {Array} parameters
 * @returns {string}
 */
function appendCustomParameters(url, parameters) {
    parameters.forEach(function (curParam) {
        if (url.indexOf('?') > -1) {
            url += '&';
        } else {
            url += '?';
        }

        let urlTappId = url.match(/(?:tappid=)\b(\d*)/i);

        if (!urlTappId) {
            url += `${curParam.name}=${curParam.value}`;
        }
    });
    return url;
}

/**
 * loads an url by tapp id and creates the iframe
 * @param {number} tappId
 * @param {string} tappUrl
 */
function loadUrlByTappId(tappId, tappUrl) {
    if (!tappId || tappId === 0) {
        console.error('No TappID found');
        return;
    }

    if (tappId !== parseInt(tappId, 10)) {
        console.error('TappID is not a number');
        return;
    }

    let $bodyContent = document.getElementById('BodyContent');
    let url = tappUrl;
    let postTobitAccessToken = tappId === -7 ? true : false;

    if (!url) {
        console.error('No Tapp Url found');
        return;
    }

    let params = url.split('?')[1].split('&');


    let urlParam =  getUrlParameters(false);
    if (urlParam) {
        params.push.apply(params, urlParam);
        url = appendCustomParameters(url, getParametersArrayByArray(urlParam));
    }

    getUrlParameters(true);

    let input = document.createElement('input');
    input.id = 'ActiveTappID';
    input.name = 'ActiveTappID';
    input.type = 'hidden';
    input.value = tappId;

    let form = document.createElement('form');
    form.action = url;
    form.target = 'CustomTappIframe';
    form.method = postTobitAccessToken ? 'post' : 'get';
    form.id = 'TobitAccessTokenForm';

    params.forEach(function (param) {
        let keyValue = param.split('=');
        let formInput = document.createElement('input');

        formInput.name = keyValue[0];
        formInput.type = 'hidden';
        formInput.value = keyValue[1];

        form.appendChild(formInput);
    });

    if (postTobitAccessToken) {
        let inputTobitAccessToken = document.createElement('input');

        inputTobitAccessToken.name = 'TobitAccessToken';
        inputTobitAccessToken.type = 'hidden';
        inputTobitAccessToken.value = window.ChaynsInfo.User.TobitAccessToken;

        form.appendChild(inputTobitAccessToken);
    }

    let iframe = document.createElement('iframe');
    iframe.frameBorder = 0;
    iframe.marginHeight = 0;
    iframe.marginWidth = 0;
    iframe.id = 'CustomTappIframe';
    iframe.name = 'CustomTappIframe';

    if (window.ChaynsInfo.IsMobile) {
        iframe.setAttribute('style', 'margin-top: -10px !important;');
    }

    let div = document.createElement('div');
    div.id = 'CustomAjaxTapp';

    $bodyContent.innerHTML = '';
    $bodyContent.appendChild(input);
    $bodyContent.appendChild(form);
    $bodyContent.appendChild(iframe);

    loadToIframe();
}