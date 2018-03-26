import executeCall from '../json-native-calls';
import errorHandler from '../call-error-handler';
import getDefer from '../../utils/defer';
import { getItem } from '../../utils/localStorage';
import { getUrlParameters } from '../../utils/url-parameter';
import ConsoleLogger from '../../utils/console-logger';

const consoleLogger = new ConsoleLogger('getTobitAccessToken(native-call)');


export default function getTobitAccessToken() {
    try {
        const defer = getDefer();

        consoleLogger.info('getTobitAccessToken');

        executeCall({
            action: 1,
            callback: {
                func: defer.resolve,
                executeOnlyOnce: true,
            },
            fallback: () => ({ tobitAccessToken: getItem(`tobitAccessToken_${getUrlParameters().locationid}`) }),
        });

        return defer.promise;
    } catch (e) {
        return errorHandler(e);
    }
}
