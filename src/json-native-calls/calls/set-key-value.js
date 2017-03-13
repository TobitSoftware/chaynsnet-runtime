import errorHandler from '../call-error-handler';
import executeCall from '../json-native-calls';
import getDefer from '../../utils/defer';
import { setItem } from '../../utils/localStorage';

export default function setKeyValue(key, value) {
    try {
        const defer = getDefer();

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
