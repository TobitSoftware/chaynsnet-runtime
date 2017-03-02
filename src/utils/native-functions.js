import { setItem, getItem } from './localStorage';


let parentWindow = (document.parentWindow && document.parentWindow.external) ? document.parentWindow.external : {},
    defaultView = (document.defaultView && document.defaultView.external) ? document.defaultView.external : {},
    windowExternal = (window.external) ? window.external : {},
    functions = {};

export function getAccessToken(accessToken) {
    if (functions.getAccessToken) {
        return functions.getAccessToken();
    }

    if (parentWindow.Chayns && 'GetAccessToken' in parentWindow.Chayns) {
        functions.getAccessToken = () => document.parentWindow.external.Chayns.GetAccessToken();
    } else if (defaultView.chayns && 'getAccessToken' in defaultView.chayns) {
        functions.getAccessToken = () => document.defaultView.external.chayns.getAccessToken();
    } else if (windowExternal.chayns && 'getAccessToken' in windowExternal.chayns) {
        functions.getAccessToken = () => window.external.chayns.getAccessToken();
    } else {
        functions.getAccessToken = () => getItem('*accessToken');
    }
    return functions.getAccessToken();
}

export function setAccessToken(accessToken) {
    if (functions.setAccessToken) {
        functions.setAccessToken(accessToken);
    }

    if (parentWindow.Chayns && 'SetAccessToken' in parentWindow.Chayns) {
        functions.setAccessToken = (accessToken) => document.parentWindow.external.Chayns.SetAccessToken(accessToken);
    } else if (defaultView.chayns && 'setAccessToken' in defaultView.chayns) {
        functions.setAccessToken = (accessToken) => document.defaultView.external.chayns.setAccessToken(accessToken);
    } else if (windowExternal.chayns && 'setAccessToken' in windowExternal.chayns) {
        functions.setAccessToken = (accessToken) => window.external.chayns.setAccessToken(accessToken);
    } else {
        functions.setAccessToken = (accessToken) => setItem('*accessToken', accessToken);
    }
    functions.setAccessToken(accessToken);
}

export function getKeyValue(key) {
    if (functions.getKeyValue) {
        return functions.getKeyValue(key);
    }

    if (parentWindow.Chayns && 'GetKeyValue' in parentWindow.Chayns) {
        functions.getKeyValue = (key) => document.parentWindow.external.Chayns.GetKeyValue(key);
    } else if (defaultView.chayns && 'getKeyValue' in defaultView.chayns) {
        functions.getKeyValue = (key) => document.defaultView.external.chayns.getKeyValue(key);
    } else if (windowExternal.chayns && 'getKeyValue' in windowExternal.chayns) {
        functions.getKeyValue = (key) => window.external.chayns.getKeyValue(key);
    } else {
        functions.getKeyValue = getItem;
    }
    return functions.getKeyValue(key);
}

export function setKeyValue(key, value) {
    if (functions.setKeyValue) {
        functions.setKeyValue(key, value);
    }

    if (parentWindow.Chayns && 'PutKeyValue' in parentWindow.Chayns) {
        functions.setKeyValue = (key, value) => document.parentWindow.external.Chayns.PutKeyValue(key, value);
    } else if (defaultView.chayns && 'putKeyValue' in defaultView.chayns) {
        functions.setKeyValue = (key, value) => document.defaultView.external.chayns.putKeyValue(key, value);
    } else if (windowExternal.chayns && 'putKeyValue' in windowExternal.chayns) {
        functions.setKeyValue = (key, value) => window.external.chayns.putKeyValue(key, value);
    } else {
        functions.setKeyValue = setItem;
    }
    functions.setKeyValue(key, value);
}

export function refreshChaynsIdIcons() {
    if (functions.refreshChaynsIdIcons) {
        functions.refreshChaynsIdIcons();
    }

    if (parentWindow.Chayns && 'RefreshDisplay' in parentWindow.Chayns) {
        functions.refreshChaynsIdIcons = () => document.parentWindow.external.Chayns.RefreshDisplay();
    } else if (defaultView.chayns && 'refreshDisplay' in defaultView.chayns) {
        functions.refreshChaynsIdIcons = () => document.defaultView.external.chayns.refreshDisplay();
    } else if (windowExternal.chayns && 'refreshChaynsId' in windowExternal.chayns) {
        functions.refreshChaynsIdIcons = () => window.external.chayns.refreshChaynsId();
    } else {
        functions.refreshChaynsIdIcons = () => console.debug('refresh chaynsId icons');
    }
    functions.refreshChaynsIdIcons();
}

export function closeWindow() {
    if (functions.closeWindow) {
        functions.closeWindow();
    }

    if (parentWindow.Window && 'Close' in parentWindow.Window) {
        functions.closeWindow = () => document.parentWindow.external.Window.Close();
    } else if (defaultView.window && 'close' in defaultView.window) {
        functions.closeWindow = () => document.defaultView.external.window.close();
    } else if (windowExternal.window && 'close' in windowExternal.window) {
        functions.closeWindow = () => window.external.window.close();
    } else {
        functions.closeWindow = () => location.reload(false);
    }
    functions.closeWindow();
}

export function resizeWindow(x, y) {
    if (functions.resizeWindow) {
        functions.resizeWindow(x, y);
    }

    if (parentWindow.Window && 'ResizeTo' in parentWindow.Window) {
        functions.resizeWindow = () => document.parentWindow.external.Window.ResizeTo(x, y);
    } else if (defaultView.window && 'resizeTo' in defaultView.window) {
        functions.resizeWindow = () => document.defaultView.external.window.resizeTo(x, y);
    } else if (windowExternal.window && 'resizeTo' in windowExternal.window) {
        functions.resizeWindow = () => window.external.window.resizeTo(x, y);
    } else {
        functions.resizeWindow = (x, y) => console.debug(`resize window to x${x}, y${y}`);
    }
    functions.resizeWindow(x, y);
}