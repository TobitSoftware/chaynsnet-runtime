import errorHandler from '../call-error-handler';
import executeCall from '../json-native-calls';
import getDefer from '../../utils/defer';

export default function closeWindow() {
    try {
        const defer = getDefer();

        executeCall({
            action: 6,
            callback: {
                func: defer.resolve,
                executeOnlyOnce: true,
            },
            fallback: () => {
                console.debug('closeWindow fallback.');
            },
        });

        return defer.promise;
    } catch (e) {
        return errorHandler(e);
    }
}
