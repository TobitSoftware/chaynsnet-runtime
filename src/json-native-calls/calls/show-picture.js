import executeCall from "../json-native-calls";
import getDefer from "../../utils/defer";
import errorHandler from "../call-error-handler";
import ConsoleLogger from "../../utils/console-logger";

const consoleLogger = new ConsoleLogger('showPicture(native-call)');

export default function showPicture(url) {
    try {
        const defer = getDefer();

        consoleLogger.debug('showPicture url:', url);

        executeCall({
            action: 12,
            data: {
                url
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
