import executeCall from '../json-native-calls';
import errorHandler from '../call-error-handler';
import getDefer from '../../utils/defer';
import ConsoleLogger from '../../utils/console-logger';

const consoleLogger = new ConsoleLogger('setIntercomChatData(native-call)');

export default function setIntercomChatData(data) {
    try {
        const defer = getDefer();

        consoleLogger.info('setIntercomChatData data:', data);

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
