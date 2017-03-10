import errorHandler from '../call-error-handler';
import executeCall from '../json-native-calls';
import getDefer from '../../utils/defer';

export default function refreshChaynsIdIcons() {
    try {
        const defer = getDefer();

        executeCall({
            action: 5,
            callback: {
                func: defer.resolve,
                executeOnlyOnce: true,
            },
            fallback: () => {
                console.debug('refreshChaynsIdIcons fallback');
            },
        });
        return defer.promise;
    } catch (e) {
        return errorHandler(e);
    }
}
