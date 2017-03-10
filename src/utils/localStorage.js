let lsExists = true;
const chaynsWebStorage = {};
const storagePrefix = 'ChaynsWeb_';

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
        chaynsWebStorage[key] = value;
    }
}

export function removeItem(key) {
    if (lsExists) {
        localStorage.removeItem(`${storagePrefix}${key}`);
    } else if (chaynsWebStorage.hasOwnProperty(key)) {
        delete chaynsWebStorage[key];
    }
}

export function getItem(key) {
    let value;

    if (lsExists) {
        value = localStorage.getItem(`${storagePrefix}${key}`);
    } else {
        value = chaynsWebStorage[key];
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
