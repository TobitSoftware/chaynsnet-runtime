import errorHandler from '../call-error-handler';
import executeCall from '../json-native-calls';
import getDefer from '../../utils/defer';
import ConsoleLogger from '../../utils/console-logger';

const consoleLogger = new ConsoleLogger('closeWindow(native-calls)');

export default function closeWindow() {
    try {
        const defer = getDefer();

        consoleLogger.info('closeWindow');

        executeCall({
            action: 6,
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
