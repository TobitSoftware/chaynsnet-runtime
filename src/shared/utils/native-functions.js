import {setItem, getItem} from './localStorage';


let parentWindow = (document.parentWindow && document.parentWindow.external) ? document.parentWindow.external : {},
    defaultView = (document.defaultView && document.defaultView.external) ? document.defaultView.external : {},
    functions = {};

export function getAccessToken(accessToken) {
    if (functions.getAccessToken) {
        return functions.getAccessToken();
    }

    if (parentWindow.Chayns && 'GetAccessToken' in parentWindow.Chayns) {
        functions.getAccessToken = document.parentWindow.external.Chayns.GetAccessToken;
    } else if (defaultView.chayns && 'getAccessToken' in defaultView.chayns) {
        functions.getAccessToken = document.defaultView.external.chayns.getAccessToken;
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
        functions.setAccessToken = document.parentWindow.external.Chayns.SetAccessToken;
    } else if (defaultView.chayns && 'setAccessToken' in defaultView.chayns) {
        functions.setAccessToken = document.defaultView.external.chayns.setAccessToken;
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
        functions.getKeyValue = document.parentWindow.external.Chayns.GetKeyValue;
    } else if (defaultView.chayns && 'getKeyValue' in defaultView.chayns) {
        functions.getKeyValue = document.defaultView.external.chayns.getKeyValue;
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
        functions.setKeyValue = document.parentWindow.external.Chayns.PutKeyValue;
    } else if (defaultView.chayns && 'putKeyValue' in defaultView.chayns) {
        functions.setKeyValue = document.defaultView.external.chayns.putKeyValue;
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
        functions.refreshChaynsIdIcons = document.parentWindow.external.Chayns.RefreshDisplay;
    } else if (defaultView.chayns && 'RefreshDisplay' in defaultView.chayns) {
        functions.refreshChaynsIdIcons = document.defaultView.external.chayns.refreshDisplay;
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
        functions.closeWindow = document.parentWindow.external.Window.Close;
    } else if (defaultView.window && 'close' in defaultView.window) {
        functions.closeWindow = document.defaultView.external.window.close;
    } else {
        functions.closeWindow = () => console.debug('window closed.');
    }
    functions.closeWindow();
}

export function resizeWindow(x, y) {
    if (functions.resizeWindow) {
        functions.resizeWindow(x, y);
    }

    if (parentWindow.Window && 'ResizeTo' in parentWindow.Window) {
        functions.resizeWindow = document.parentWindow.external.Window.ResizeTo;
    } else if (defaultView.window && 'ResizeTo' in defaultView.window) {
        functions.resizeWindow = document.defaultView.external.window.ResizeTo;
    } else {
        functions.resizeWindow = (x, y) => console.debug(`resize window to x${x}, y${y}`);
    }
    functions.resizeWindow(x, y);
}