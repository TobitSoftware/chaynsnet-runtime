let initialized = false;

const applicationName = 'ChaynsWebJS';
const fnRegex = /at\s([\w.]+)\s\(/i;
const appversion = 'js';
const defaultSection = 'web';

export const type = {
    debug: 10,
    request: 15,
    information: 20,
    warning: 30,
    error: 40,
    critical: 50
};

/**
 * Initializes the logger
 */
export function init() {
    if (initialized) {
        return;
    }

    window.onerror = logError;

    initialized = true;
}

function sendLogToServer(obj) {
    var loggerUrl = 'https://david.tobit.software/Log/Log';

    var xmlhttp = new XMLHttpRequest();
    var url = loggerUrl;

    obj.appversion = appversion;

    xmlhttp.open('POST', url, true);
    xmlhttp.setRequestHeader('Content-type', 'application/json');
    xmlhttp.send(JSON.stringify(obj));
}

//noinspection JSUnusedLocalSymbols
function logError(errorMsg, url, lineNumber, column, error) {
    try {
        var fnName = fnRegex.exec(error.stack)[1];

        var obj = {
            msg: error.message,
            section: fnName,
            stacktrace: error.stack,
            exception: error.name,
            type: type.error,
            applicationname: applicationName,
            tappId: window.Navigation.GetActiveTappID()
        };

        if (window.ChaynsInfo && window.ChaynsInfo.SiteID) {
            obj.siteid = window.ChaynsInfo.SiteID;
        }

        sendLogToServer(obj);
    } catch (err) {
        //Nichts machen, um Endlosschleife zu vermeiden
    }
}

export function log(logObj) {
    logObj.section = logObj.section || defaultSection;
    logObj.url = logObj.url || location.href;

    if (typeof logObj.type !== 'number') {
        logObj.type = type.debug;
    }

    sendLogToServer(logObj);
}