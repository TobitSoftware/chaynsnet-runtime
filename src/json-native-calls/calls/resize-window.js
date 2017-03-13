import errorHandler from '../call-error-handler';
import executeCall from '../json-native-calls';
import getDefer from '../../utils/defer';

export default function resizeWindow(x, y) {
    try {
        const defer = getDefer();

        executeCall({
            action: 7,
            data: {
                x,
                y
            },
            callback: {
                func: defer.resolve,
                executeOnlyOnce: true,
            },
            fallback: () => {
                console.debug(`resizeWindow fallback. | {x:${x}, | y:${y}`);
            },
        });

        return defer.promise;
    } catch (e) {
        return errorHandler(e);
    }
}
