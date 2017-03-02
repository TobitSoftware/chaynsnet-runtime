import jsonCalls from '../json-call/json-calls.js';
import * as jsonCallHelper from '../json-call/json-call-helper';

export function chaynscall(param, srcIframe) {
    let value;
    let action;

    if (typeof (param) === 'string') {
        try {
            let temp = JSON.parse(param);
            value = temp.value;
            action = temp.action;
        } catch (e) {
            jsonCallHelper.throwEvent(window.NaN, 4, 'Error parsing JSON', param, srcIframe);
            return;
        }
    } else if (typeof (param) === 'object' && param.action !== undefined) {
        value = param.value;
        action = param.action;
    } else {
        jsonCallHelper.throwEvent(window.NaN, 2, 'Field action missing', param, srcIframe);
        return;
    }

    if (typeof value !== 'object' && typeof value === 'string') {
        try {
            value = JSON.parse(value);
        } catch (e) {
            jsonCallHelper.throwEvent(action, 4, 'Error parsing JSON', param, srcIframe);
            return;
        }
    }
    if (typeof jsonCalls[action] === 'function') {
        jsonCalls[action](value, srcIframe);
    } else {
        jsonCallHelper.throwEvent(action, 3, 'chaynsCall ' + action + ' doesn\'t exist', value, srcIframe);
    }
}

export const jsoncall = chaynscall;