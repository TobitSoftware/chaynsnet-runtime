import errorHandler from '../call-error-handler';
import executeCall from '../json-native-calls';
import getDefer from '../../utils/defer';
import ConsoleLogger from '../../utils/console-logger';

const consoleLogger = new ConsoleLogger('refreshChaynsIdIcons(native-call)');

export default function refreshChaynsIdIcons() {
    try {
        const defer = getDefer();

        consoleLogger.info('refreshChaynsIdIcons');

        executeCall({
            action: 5,
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
