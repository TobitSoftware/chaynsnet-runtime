import { decodeTobitAccessToken } from '../../utils/convert';
import { extendRenewToken, getUserTokenByRenewToken, isTokenValid } from '../../utils/tobitAuth';
import executeCall from '../json-native-calls';
import errorHandler from '../call-error-handler';
import getDefer from '../../utils/defer';
import { getItem, removeItem, setItem } from '../../utils/localStorage';
import { getUrlParameters } from '../../utils/url-parameter';
import ConsoleLogger from '../../utils/console-logger';

const consoleLogger = new ConsoleLogger('getTobitAccessToken(native-call)');

const DAY_IN_MILLISECONDS = 24 * 60 * 60 * 1000;
const renewTokenCacheKey = `renewToken_${getUrlParameters().locationid}`;
const userTokenCacheKey = `tobitAccessToken_${getUrlParameters().locationid}`;

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
            fallback: async () => ({ tobitAccessToken: await getUserToken() })
        });

        return defer.promise;
    } catch (e) {
        return errorHandler(e);
    }
}


async function getUserToken() {
    let renewToken = getItem(renewTokenCacheKey);
    if (!renewToken) {
        consoleLogger.debug('no renew token in cache');
        return null;
    }

    const renewTokenDecoded = decodeTobitAccessToken(renewToken);
    if (renewTokenDecoded.exp * 1000 <= Date.now()) {
        consoleLogger.debug('renew token was expired');
        removeItem(renewTokenCacheKey);
        return null;
    } else if (renewTokenDecoded.iat * 1000 > Date.now() + DAY_IN_MILLISECONDS) { // a renew token can first be extended after 24 hours
        renewToken = await extendRenewToken(renewToken);

        if (renewToken) {
            consoleLogger.debug('extended renew token');
            setItem(renewTokenCacheKey, renewToken);
        } else {
            consoleLogger.debug('extend renew token failed');
            removeItem(renewTokenCacheKey);
            return null;
        }
    }

    const cachedUserToken = getItem(userTokenCacheKey);

    if (cachedUserToken) {
        const cachedUserTokenDecoded = decodeTobitAccessToken(cachedUserToken);
        const cachedUserTokenExpirationTime = new Date(cachedUserTokenDecoded.exp).getTime();
        if (cachedUserTokenExpirationTime > Date.now() + DAY_IN_MILLISECONDS && await isTokenValid(cachedUserToken)) {
            consoleLogger.debug('took valid user token from cache');
            return cachedUserToken;
        }
    }

    consoleLogger.debug('request new user token');
    const userToken = await getUserTokenByRenewToken(renewToken);
    setItem(userTokenCacheKey, userToken);

    return userToken;
}
