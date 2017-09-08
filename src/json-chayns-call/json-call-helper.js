import postMessage from '../tapp/custom-tapp-communication';
import ConsoleLogger from '../utils/console-logger';

const consoleLogger = new ConsoleLogger('json-call-helper.js');
let jsonCallEventListener = [];

export function addJsonCallEventListener(action, request, srcIframe) {
    jsonCallEventListener.push({
        callback: request.callback,
        addJSONParam: request.addJSONParam,
        srcIframe,
        action
    });
}

export function dispatchJsonCallEvent(action, response, destIframe) {
    let result = false;

    jsonCallEventListener.forEach((listener) => {
        if ((listener.action !== action) || (destIframe && listener.srcIframe !== destIframe)) {
            return;
        }

        answerJsonCall(listener, response, (destIframe || listener.srcIframe));
        result = true;
    });

    return result;
}

export function removeJsonCallEventListener(action, callback) {
    jsonCallEventListener = jsonCallEventListener.filter((listener) => {
        if (listener.action === action) {
            return !(!callback || listener.callback === callback);
        }
        return true;
    });
}

export function throwEvent(action, code, message, request, srcIframe) {
    const retVal = {
        errorCode: code,
        value: request,
        action,
        message,
    };

    consoleLogger.warn('throwEvent', retVal);

    dispatchJsonCallEvent(75, retVal, srcIframe);
}

export function answerJsonCall(request, response, srcIframe) {
    const params = JSON.stringify({
        addJSONParam: request.addJSONParam || {},
        retVal: response || {},
        callback: request.callback
    });
    postMessage('jsoncall', params, srcIframe);
}
