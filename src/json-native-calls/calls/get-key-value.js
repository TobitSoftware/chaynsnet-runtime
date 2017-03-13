import errorHandler from '../call-error-handler';
import executeCall from '../json-native-calls';
import getDefer from '../../utils/defer';
import { getItem } from '../../utils/localStorage';
import ConsoleLogger from '../../utils/console-logger';

const consoleLogger = new ConsoleLogger('getKeyValue(native-call)');


export default function getKeyValue(key) {
    try {
        const defer = getDefer();

        consoleLogger.info('getKeyValue key:', key);

        executeCall({
            action: 3,
            data: {
                key
            },
            callback: {
                func: defer.resolve,
                executeOnlyOnce: true,
            },
            fallback: () => ({ value: getItem(key) }),
        });

        return defer.promise;
    } catch (e) {
        return errorHandler(e);
    }
}
