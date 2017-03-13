import errorHandler from '../call-error-handler';
import executeCall from '../json-native-calls';
import getDefer from '../../utils/defer';
import { getItem } from '../../utils/localStorage';

export default function getKeyValue(key) {
    try {
        const defer = getDefer();

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
