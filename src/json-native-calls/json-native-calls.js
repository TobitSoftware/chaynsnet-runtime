import logger from 'chayns-logger';

import RESULT_STATUS from '../constants/native-calls-status';

const callbacks = {};
let id = 0;

/**
 *  Executes JSON NativeCalls
 * @param config
 */
export default async function executeCall(config) {
    if (typeof config !== 'object' || config === null) {
        console.warn('config must be an object. Take a look at the wiki');
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

    if (typeof window.external.jsonCall !== 'function') {
        if (typeof fallback === 'function') {
            func({
                parameter: parameter || {},
                data: fallback(data),
                status: {
                    code: 1
                }
            });
        }
        return false;
    }

    const callId = id;
    id += 1;

    const callConfig = {
        action,
        value: {
            callback: 'window.external.callback',
            id: callId,
            parameter,
            data
        }
    };
    callbacks[callId] = {
        func,
        executeOnlyOnce,
        fallback
    };

    console.debug('callback config', callConfig);
    window.external.jsonCall(JSON.stringify(callConfig));
    return true;
}

export function callBackHandler(result) {
    try {
        console.debug('callback result', result);
        const { id: callId, parameter, data, status } = result;

        const callback = callbacks[callId];
        if (callback !== undefined) {
            const { func, executeOnlyOnce, fallback } = callback;

            if (result.status.code === RESULT_STATUS.NOT_AVAILABLE) {
                console.warn('Call is not supported');
                func({
                    parameter: parameter || {},
                    data: fallback() || {},
                    status: status || {}
                });

                delete callbacks[callId];
            } else {
                func({
                    parameter: parameter || {},
                    data: data || {},
                    status: status || {}
                });

                if (executeOnlyOnce) {
                    delete callbacks[callId];
                }
            }

        } else {
            console.warn('no callback found', callId, callbacks);
            logger.error({
                message: 'no json NativeCalls callback found',
                customNumber: callId,
            });
        }
    } catch (e) {
        logger.error({
            fileName: 'json-native-calls',
            section: 'callBackHandler',
            ex: {
                message: e.message,
                stackTrace: e.stack
            }
        });
        console.error(e);
    }
}
