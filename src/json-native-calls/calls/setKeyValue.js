import logger from 'chayns-logger';
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
        logger.error({
            ex: {
                message: e.message,
                stackTrace: e.stack
            }
        });
        console.error(e);
        return Promise.resolve('');
    }
}
window.setKeyValue = setKeyValue;