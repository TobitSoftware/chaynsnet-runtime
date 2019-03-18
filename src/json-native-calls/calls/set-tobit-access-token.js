import executeCall from '../json-native-calls';
import errorHandler from '../call-error-handler';
import getDefer from '../../utils/defer';
import { getItem, setItem } from '../../utils/localStorage';
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
                setItem(`renewToken_${getUrlParameters().locationid}`, tobitAccessToken);
            },
        });

        return defer.promise;
    } catch (e) {
        return errorHandler(e);
    }
}
