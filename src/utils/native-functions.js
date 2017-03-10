let parentWindow = (document.parentWindow && document.parentWindow.external) ? document.parentWindow.external : {},
    defaultView = (document.defaultView && document.defaultView.external) ? document.defaultView.external : {},
    windowExternal = (window.external) ? window.external : {},
    functions = {};


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
