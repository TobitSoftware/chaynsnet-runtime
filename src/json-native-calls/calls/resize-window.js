import errorHandler from '../call-error-handler';
import executeCall from '../json-native-calls';
import getDefer from '../../utils/defer';
import ConsoleLogger from '../../utils/console-logger';

const consoleLogger = new ConsoleLogger('resizeWindow(native-call)');

export default function resizeWindow(x, y) {
    try {
        const defer = getDefer();

        consoleLogger.info(`resizeWindow { x:${x}, y:${y} }`);

        executeCall({
            action: 7,
            data: {
                x,
                y
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
