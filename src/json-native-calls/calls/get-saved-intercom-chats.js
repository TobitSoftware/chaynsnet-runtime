import errorHandler from '../call-error-handler';
import executeCall from '../json-native-calls';
import getDefer from '../../utils/defer';

export default function getSavedIntercomChats(itemId) {
    try {
        const defer = getDefer();

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
