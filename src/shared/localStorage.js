let lsExists = true;
let chaynsWebStorage;
let storagePrefix = 'ChaynsWeb_';

export function init() {
    try {
        localStorage.setItem('test123', 123);
        localStorage.getItem('test123');
        lsExists = true;
    } catch (err) {
        lsExists = false;
        chaynsWebStorage = window.Storage = {};
    }
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
    } else {
        if (chaynsWebStorage.hasOwnProperty(key)) {
            delete chaynsWebStorage[key];
        }
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