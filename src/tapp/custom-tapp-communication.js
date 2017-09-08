import logger from 'chayns-logger';
import executeChaynsCall from '../json-chayns-call/execute-chayns-call';

const chaynsNamespace = /^(chayns.\w*).(\w*)@?(\w*)?:({?.*}?)/;
let initialized = false;

document.addEventListener('DOMContentLoaded', () => {
    if (!initialized) {
        initialized = true;
        window.addEventListener('message', onWindowMessage);
    }
}, false);

function onWindowMessage(event) {
    const [, namespace, method, srcIFrame, params] = chaynsNamespace.exec(event ? event.data : '') || [];

    if (method) {
        if (method.toLowerCase() === 'jsoncall') {
            executeChaynsCall(params, [
                srcIFrame ? document.querySelector(`[name="${srcIFrame}"]`) : null,
                namespace
            ]);
        }
    }
}

export default function postMessage(method, params = '', [srcIframe, namespace = 'chayns.customTab']) {
    const iframe = srcIframe || document.querySelector('#TappIframe');
    if (!iframe) {
        return;
    }

    const srcWindow = iframe.contentWindow || iframe;

    if (typeof srcWindow.postMessage === 'function') {
        try {
            srcWindow.postMessage(`${namespace}.${method}:${params.toString()}`, '*');
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
