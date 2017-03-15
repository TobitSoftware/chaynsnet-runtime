import logger from 'chayns-logger';
import * as functions from './communication-functions';

function init() {
    window.addEventListener('message', onWindowMessage);
}

let domAlreadyLoaded = false;

document.addEventListener('DOMContentLoaded', () => {
    if (!domAlreadyLoaded) {
        domAlreadyLoaded = true;
        init();
    }
}, false);

function onWindowMessage(event) {
    let chaynsNamespace = /^((chayns.\w*.)(\w*))@?(\w*)?:(\{?.*}?)/;

    // 0-1: string, 2: namespace, 3: method, 4: sourceIFrame, 5: Params
    let result = chaynsNamespace.exec(event ? event.data : '');
    if (result) {
        if (result[3]) {
            let fn = functions[result[3].toLowerCase()];
            if (typeof fn == 'function') {
                fn(result[5], [
                    result[4] ? document.querySelector(`[name="${result[4]}"]`) : null,
                    result[2]
                ]);
            }
        }
    }
}

export function postMessage(method, params, source) {
    let win = null;
    let $customTappIframe = document.querySelector('#TappIframe');
    let iframe = source[0] ? source[0] : $customTappIframe;

    if (iframe !== null) {
        win = iframe.contentWindow ? iframe.contentWindow : iframe;
    }

    if (win && typeof win.postMessage === 'function') {
        params = params || '';
        try {
            win.postMessage((source[1] || 'chayns.customTab.' ) + method + ':' + params.toString(), '*');
        } catch (e) {
            logger.error({
                message: e.message,
                fileName: 'custom-tapp-communication.js',
                section: 'custom-tapp-communication.postMessage',
                ex: {
                    message: e.message,
                    stackTrace: e.stack
                }
            });
        }
    }
}

export function answerJsonCall(request, response, srcIframe) {
    let params = JSON.stringify({
        addJSONParam: request.addJSONParam || {},
        retVal: response || {},
        callback: request.callback
    });
    postMessage('jsoncall', params, srcIframe);
}