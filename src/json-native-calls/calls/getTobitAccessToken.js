import executeCall from '../json-native-calls';
import errorHandler from '../call-error-handler';
import getDefer from '../../utils/defer';
import { getItem } from '../../utils/localStorage';
import { getUrlParameters } from '../../utils/helper';

export default function getTobitAccessToken() {
    const defer = getDefer();
    try {
        executeCall({
            action: 1,
            callback: {
                func: defer.resolve,
                executeOnlyOnce: true,
            },
            fallback: () => ({ tobitAccessToken: getItem(`chaynsWebLight_tobitAccessToken_${getUrlParameters().locationid}`) }),
        });
        return defer.promise;
    } catch (e) {
        return defer.resolve(errorHandler(e));
    }
}
