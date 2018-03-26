import logger from 'chayns-logger';
import ConsoleLogger from './console-logger';
import { chaynsInfo } from '../chayns-info';
import { setKeyValue, getKeyValue } from '../json-native-calls/calls/index';

const consoleLogger = new ConsoleLogger('(chayns-storage.js)');

export const ACCESS_MODES = {
    public: 0,
    protected: 1,
    private: 2
};

const getStorageKey = () => `tappKeyStorage-${chaynsInfo.SiteID}`;

const read = async () => (await getKeyValue(getStorageKey())).data.value || [];
const write = value => setKeyValue(getStorageKey(), value);


function createItem(key, tappId, value, accessMode = ACCESS_MODES.public, tappIds) {
    const item = {};
    item.Key = key;
    item.OriginTappID = tappId;
    item.AccessMode = accessMode;
    item.TappIDs = tappIds || [];
    if (item.TappIDs.indexOf(item.OriginTappID) < 0) {
        item.TappIDs.push(item.OriginTappID);
    }
    item.Value = value;
    return item;
}

function getItemFromStorage(storage, tappId, key, accessMode = ACCESS_MODES.public) {
    if (storage && storage.length) {
        for (const item of storage) {
            if (item.Key === key && item.AccessMode === accessMode) {
                switch (item.AccessMode) {
                    case ACCESS_MODES.public:
                        return item;
                    case ACCESS_MODES.private:
                        if (item.OriginTappID === tappId) {
                            return item;
                        }
                        break;
                    case ACCESS_MODES.protected:
                        if (item.TappIDs.indexOf(tappId) >= 0) {
                            return item;
                        }
                        break;
                    default:
                        break;
                }
            }
        }
    }
    return undefined;
}

export const removeKeyForTapp = async (tappId, key, accessMode) => {
    try {
        const storage = await read();
        const keyItem = getItemFromStorage(storage, tappId, key, accessMode);

        if (keyItem) {
            storage.splice(storage.indexOf(keyItem), 1);
            await write(storage);
        }
    } catch (e) {
        logger.error({
            ex: {
                message: e.message,
                stackTrace: e.stack
            }
        });
        consoleLogger.error(e);
    }
};

export const setKeyForTapp = async (tappId, key, value, accessMode, tappIds) => {
    try {
        const storage = await read();
        const savedItem = getItemFromStorage(storage, tappId, key, accessMode);

        if (savedItem) {
            storage.splice(storage.indexOf(savedItem), 1);
        }

        if (value) {
            storage.push(createItem(key, tappId, value, accessMode, tappIds));
        }

        await write(storage);
    } catch (e) {
        logger.error({
            ex: {
                message: e.message,
                stackTrace: e.stack
            }
        });
        consoleLogger.error(e);
    }
};

export const getKeyForTapp = async (tappId, key, accessMode) => {
    try {
        const storage = await read();
        const keyItem = getItemFromStorage(storage, tappId, key, accessMode);
        return (keyItem) ? keyItem.Value : undefined;
    } catch (e) {
        logger.error({
            ex: {
                message: e.message,
                stackTrace: e.stack
            }
        });
        consoleLogger.error(e);
        return null;
    }
};
