import { answerJsonCall } from '../tapp/custom-tapp-communication';

let jsonCallEventListener = [];

export const overlayCloseParam = {};

export function addJsonCallEventListener(action, request, srcIframe) {
    jsonCallEventListener.push({
        callback: request.callback,
        addJSONParam: request.addJSONParam,
        srcIframe,
        action
    });
}

/**
 * @return {boolean}
 */
export function dispatchJsonCallEvent(action, response, destIframe) {
    let result = false;

    jsonCallEventListener.forEach((listener) => {
        if ((listener.action !== action) || (destIframe && listener.srcIframe !== destIframe)) {
            return;
        }

        if (!destIframe) {
            destIframe = listener.srcIframe;
        }

        answerJsonCall(listener, response, destIframe);
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

    dispatchJsonCallEvent(75, retVal, srcIframe);
}

/**
 * @return {number}
 */
export function encodeDialogButtonTypes(type) {
    return type <= 0 ? type - 10 : type;
}

/**
 * @return {number}
 */
export function decodeDialogButtonTypes(type) {
    return type <= -10 ? type + 10 : type;
}

export function throttle(fn, threshhold = 250, scope) {
    let last;
    let deferTimer;

    return (...args) => {
        const context = scope || this;
        const now = Date.now();

        if (last && now < last + threshhold) {
            clearTimeout(deferTimer);

            deferTimer = setTimeout(() => {
                last = now;
                fn.apply(context, args);
            }, threshhold);
        } else {
            last = now;
            fn.apply(context, args);
        }
    };
}
