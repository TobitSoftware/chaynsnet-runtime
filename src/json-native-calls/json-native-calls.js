import logger from 'chayns-logger';
import uuidV1 from 'uuid/v1';
import { IS_DAVID_WINDOWS, DAVID_VERSION_WINDOWS } from '../utils/environment';
import ConsoleLogger from '../utils/console-logger';

import RESULT_STATUS from '../constants/native-calls-status';

const consoleLoggerExecute = new ConsoleLogger('executeCall(json-native-calls.js)');
const consoleLoggerCallback = new ConsoleLogger('callbackHandler(json-native-calls.js)');

const callbacks = {};
let id = 0;

/**
 *  Executes JSON NativeCalls
 * @param config
 */
export default async function executeCall(config) {
    if (typeof config !== 'object' || config === null) {
        consoleLoggerExecute.error('Config must be an object. Take a look at the git repositories wiki.');
        return false;
    }

    const {
        action,
        data,
        parameter,
        callback: {
            func,
            executeOnlyOnce
        },
        fallback,
    } = config;

    let jsonCallFn;
    let davidWebviewV2 = false;
    if (typeof window.external === 'object' && typeof window.external.jsonCall === 'function') {
        jsonCallFn = window.external.jsonCall;
    } else if (typeof chrome === 'object' && chrome.webview && chrome.webview.hostObjects && chrome.webview.hostObjects.sync && chrome.webview.hostObjects.sync.chayns && typeof chrome.webview.hostObjects.sync.chayns.jsonCall === 'function') {
        davidWebviewV2 = true;
        jsonCallFn = chrome.webview.hostObjects.sync.chayns.jsonCall;
    }

    if (typeof jsonCallFn !== 'function') {
        if (typeof fallback === 'function') {
            consoleLoggerExecute.debug('native-calls are not supported -> fallback.');

            let fallbackRes = fallback(data);

            if (fallbackRes instanceof Promise) {
                fallbackRes = await fallbackRes;
            }

            func({
                parameter: parameter || {},
                data: fallbackRes || {},
                status: {
                    code: RESULT_STATUS.FALLBACK
                }
            });
        } else {
            consoleLoggerExecute.debug('native-calls are not supported.');
            func({
                parameter: parameter || {},
                data: {},
                status: {
                    code: RESULT_STATUS.NOT_AVAILABLE
                }
            });
        }
        return false;
    }

    const callId = (IS_DAVID_WINDOWS && DAVID_VERSION_WINDOWS < 6853) ? id : uuidV1();
    id += 1;

    const callConfig = {
        action,
        value: {
            callback: 'window.nativeCallCallback',
            id: callId,
            parameter,
            data
        }
    };
    callbacks[callId] = {
        func,
        executeOnlyOnce,
        fallback,
        callData: data
    };

    consoleLoggerExecute.info(`execute call { callId: ${callId} }`, callConfig);
    if (davidWebviewV2) {
        chrome.webview.hostObjects.sync.chayns.jsonCall(JSON.stringify(callConfig));
    } else {
        window.external.jsonCall(JSON.stringify(callConfig));
    }
    // jsonCallFn(JSON.stringify(callConfig));
    return true;
}

export function callbackHandler(result) {
    try {
        const { id: callId, parameter, data, status } = result;

        consoleLoggerCallback.debug(`result { callId: ${callId} }`, result);

        const callback = callbacks[callId];
        if (callback !== undefined) {
            const { func, executeOnlyOnce, fallback, callData } = callback;

            if (result.status.code === RESULT_STATUS.NOT_AVAILABLE && typeof fallback === 'function') {
                consoleLoggerCallback.debug(`Call is not Supported -> use fallback. { callId: ${callId} }`);
                func({
                    parameter: parameter || {},
                    data: fallback(callData) || {},
                    status: {
                        code: RESULT_STATUS.FALLBACK
                    },
                });
            } else {
                if (result.status.code === RESULT_STATUS.NOT_AVAILABLE) {
                    consoleLoggerCallback.error(`Call is not Supported. { callId: ${callId} }`);
                }

                func({
                    parameter: parameter || {},
                    data: data || {},
                    status: status || {},
                });
            }

            if (executeOnlyOnce) {
                delete callbacks[callId];
            }
        } else {
            consoleLoggerCallback.error('no callback found', callId, callback);
            logger.error({
                message: 'no json NativeCalls callback found',
                customNumber: callId,
                fileName: 'json-native-calls',
                section: 'callbackHandler',
            });
        }
    } catch (e) {
        consoleLoggerCallback.error(e);
        logger.error({
            fileName: 'json-native-calls',
            section: 'callbackHandler',
            ex: {
                message: e.message,
                stackTrace: e.stack
            }
        });
    }
}
