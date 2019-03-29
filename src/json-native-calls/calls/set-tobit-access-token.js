import { invalidateToken } from '../../utils/tobitAuth';
import executeCall from '../json-native-calls';
import errorHandler from '../call-error-handler';
import getDefer from '../../utils/defer';
import { getItem, removeItem, setItem } from '../../utils/localStorage';
import { getUrlParameters } from '../../utils/url-parameter';
import ConsoleLogger from '../../utils/console-logger';

const consoleLogger = new ConsoleLogger('setTobitAccessToken(native-call)');


export default function setTobitAccessToken(tobitAccessToken) {
    try {
        const defer = getDefer();

        consoleLogger.info('setTobitAccessToken token:', tobitAccessToken);

        executeCall({
            action: 2,
            data: {
                tobitAccessToken
            },
            callback: {
                func: defer.resolve,
                executeOnlyOnce: true,
            },
            fallback: () => {
                const renewToken = getItem(`renewToken_${getUrlParameters().locationid}`);
                const userToken = getItem(`tobitAccessToken_${getUrlParameters().locationid}`);

                if (renewToken && renewToken.length > 0) {
                    invalidateToken(renewToken);
                }

                if (userToken && userToken.length > 0) {
                    invalidateToken(userToken);
                }
                removeItem(`tobitAccessToken_${getUrlParameters().locationid}`);

                if (tobitAccessToken && tobitAccessToken.length > 0) {
                    setItem(`renewToken_${getUrlParameters().locationid}`, tobitAccessToken);
                } else {
                    removeItem(`renewToken_${getUrlParameters().locationid}`);
                }
            },
        });

        return defer.promise;
    } catch (e) {
        return errorHandler(e);
    }
}
