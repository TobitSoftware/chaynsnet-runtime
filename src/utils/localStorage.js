let lsExists = true;
const applicationStorage = {};
const storagePrefix = 'chaynsnet-runtime_';

/**
 * Inits localStorage helper.
 */
try {
    localStorage.setItem('test123', 123);
    localStorage.getItem('test123');
    lsExists = true;
    localStorage.removeItem('test123');
} catch (err) {
    lsExists = false;
}


export function setItem(key, value) {
    if (typeof value !== 'string') {
        value = JSON.stringify(value);
    }

    if (lsExists) {
        localStorage.setItem(`${storagePrefix}${key}`, value);
    } else {
        applicationStorage[key] = value;
    }
}

export function removeItem(key) {
    if (lsExists) {
        localStorage.removeItem(`${storagePrefix}${key}`);
    } else if (applicationStorage.hasOwnProperty(key)) {
        delete applicationStorage[key];
    }
}

export function getItem(key) {
    let value;

    if (lsExists) {
        value = localStorage.getItem(`${storagePrefix}${key}`);
    } else {
        value = applicationStorage[key];
    }

    try {
        return JSON.parse(value);
    } catch (e) {
        return value;
    }
}

export function localStorageExists() {
    return lsExists;
}
