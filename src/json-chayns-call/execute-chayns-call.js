import logger from 'chayns-logger';
import ConsoleLogger from '../utils/console-logger';
import { addJsonCallEventListener, throwEvent, answerJsonCall } from './json-call-helper';
import jsonCalls from './json-calls';

const consoleLogger = new ConsoleLogger('execute-json-call.js');

export default (param, srcIframe) => {
    let value;
    let action;

    if (typeof (param) === 'string') {
        try {
            const temp = JSON.parse(param);
            ({ value, action } = temp);
        } catch (e) {
            throwEvent(window.NaN, 4, 'Error parsing JSON', param, srcIframe);
            return;
        }
    } else if (typeof (param) === 'object' && param.action !== undefined) {
        ({ value, action } = param);
    } else {
        throwEvent(window.NaN, 2, 'Field action missing', param, srcIframe);
        return;
    }

    if (typeof value === 'string') {
        try {
            value = JSON.parse(value);
        } catch (e) {
            throwEvent(action, 4, 'Error parsing JSON', param, srcIframe);
            return;
        }
    }

    if (typeof jsonCalls[action] === 'function') {
        const req = {
            action,
            srcIframe,
            value: value || {},
            addJsonCallEventListener: action => addJsonCallEventListener(action, value, srcIframe)
        };
        const res = {
            event: (code, message) => throwEvent(action, code, message, value, srcIframe),
            answer: response => answerJsonCall(value, response, srcIframe)
        };

        jsonCalls[action](req, res);
    } else {
        throwEvent(action, 3, `chaynsCall ${action} doesn't exist`, value, srcIframe);

        consoleLogger.warn(`Requested chaynsCall with action ${action} is not supported.`);
        logger.info({
            message: 'Requested chaynsCall with action {customNumber} is not supported',
            customNumber: action,
            fileName: 'execute-json-call.js',
            section: 'executeChaynsCall',
        });
    }
};
