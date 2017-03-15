import errorHandler from '../call-error-handler';
import executeCall from '../json-native-calls';
import getDefer from '../../utils/defer';
import ConsoleLogger from '../../utils/console-logger';

const consoleLogger = new ConsoleLogger('getSavedIntercomChats(native-call)');

export default function getSavedIntercomChats(itemId) {
    try {
        const defer = getDefer();

        consoleLogger.debug('getSavedIntercomChats itemId:', itemId);

        executeCall({
            action: 8,
            data: {
                itemId
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
