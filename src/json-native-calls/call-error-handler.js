import logger from 'chayns-logger';
import RESULT_STATUS from '../constants/native-calls-status';
import ConsoleLogger from '../utils/console-logger';

const consoleLogger = new ConsoleLogger('call-error-hander.js');

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

    consoleLogger.error(e);

    return Promise.resolve({
        parameter: {},
        data: {},
        status: {
            code: RESULT_STATUS.ERROR,
            description: e.message
        }
    });
}