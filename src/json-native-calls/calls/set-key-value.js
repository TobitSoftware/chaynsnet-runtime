import errorHandler from '../call-error-handler';
import executeCall from '../json-native-calls';
import getDefer from '../../utils/defer';
import { setItem } from '../../utils/localStorage';
import ConsoleLogger from '../../utils/console-logger';

const consoleLogger = new ConsoleLogger('setKeyValue(native-call)');


export default function setKeyValue(key, value) {
    try {
        const defer = getDefer();

        consoleLogger.info('setKeyValue key:', key, ' value:', value);

        executeCall({
            action: 3,
            data: {
                key,
                value
            },
            callback: {
                func: defer.resolve,
                executeOnlyOnce: true,
            },
            fallback: () => {
                setItem(key, value);
            },
        });

        return defer.promise;
    } catch (e) {
        return errorHandler(e);
    }
}
