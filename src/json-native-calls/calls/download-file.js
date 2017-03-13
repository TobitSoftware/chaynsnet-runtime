import errorHandler from '../call-error-handler';
import executeCall from '../json-native-calls';
import getDefer from '../../utils/defer';
import ConsoleLogger from '../../utils/console-logger';

const consoleLogger = new ConsoleLogger('downloadFile(native-call)');

export default function downloadFile(url, filename) {
    try {
        const defer = getDefer();

        consoleLogger.info('downloadFile url:', url, ' filename:', filename);

        executeCall({
            action: 10,
            data: {
                url,
                name: filename
            },
            callback: {
                func: defer.resolve,
                executeOnlyOnce: true,
            },
        });

        return defer.promise;
    } catch (e) {
        return errorHandler(e);
    }
}
