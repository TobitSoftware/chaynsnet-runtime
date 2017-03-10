import logger from 'chayns-logger';
import RESULT_STATUS from '../constants/native-calls-status';
import { isLIVE } from '../constants/environments';

export default (e, section, fileName) => {
    logger.error({
        message: 'NativeCall error handler',
        section,
        fileName,
        ex: {
            message: e.message,
            stackTrace: e.stack
        }
    });

    if (!isLIVE) {
        console.error(e);
    }

    return {
        data: {},
        status: {
            code: RESULT_STATUS.ERROR,
            description: e.message
        }
    };
}