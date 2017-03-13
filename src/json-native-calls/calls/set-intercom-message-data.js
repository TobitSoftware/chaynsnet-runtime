import executeCall from '../json-native-calls';
import errorHandler from '../call-error-handler';
import getDefer from '../../utils/defer';

export default function setIntercomMessageData(data) {
    try {
        const defer = getDefer();

        executeCall({
            action: 9,
            data: {
                ...data
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
