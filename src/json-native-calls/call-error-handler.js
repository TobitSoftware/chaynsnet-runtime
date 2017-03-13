import logger from 'chayns-logger';
import RESULT_STATUS from '../constants/native-calls-status';
import { isLIVE } from '../constants/environments';
import { getUrlParameters } from '../utils/helper';

export default (e, section = 'NativeCallErrorHandler.', fileName = 'call-error-handler.js') => {
    logger.error({
        message: 'JSONNativeCall error handler.',
        section,
        fileName,
        ex: {
            message: e.message,
            stackTrace: e.stack
        }
    });

    if (!isLIVE || !getUrlParameters().debug === '1') {
        console.error('NativeCallErrorHandler', e);
    }

    return Promise.resolve({
        parameter: {},
        data: {},
        status: {
            code: RESULT_STATUS.ERROR,
            description: e.message
        }
    });
}