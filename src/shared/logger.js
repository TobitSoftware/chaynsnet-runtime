import Request from './utils/request';

const fnRegex = /at\s([\w.]+)\s\(/i;

const LOG_LEVEL = {
    REQUEST: 15,
    INFORMATION: 20,
    WARNING: 30,
    ERROR: 40,
    CRITICAL: 50
};

let timeOut = null,
    logs = [];
/**
 * Initializes the logger
 */

window.onerror = (errorMsg, url, lineNumber, column, error) => {
    const urlParts = url.split('/');
    const fileName = (urlParts.length > 0) ? urlParts[urlParts.length - 1] : ' - ';
    const funcName = (error) ? fnRegex.exec(error.stack)[1] : ' - ';
    Logger.error(errorMsg, error, `${fileName}:${funcName}`, lineNumber);
};


export default class Logger {
    static request(message, data = {}, section) {
        data.message = message;
        log(LOG_LEVEL.REQUEST, data, section);
    }

    static info(message, data = {}, section) {
        data.message = message;
        log(LOG_LEVEL.INFORMATION, data, section);
    }

    static warning(message, data = {}, section) {
        data.message = message;
        log(LOG_LEVEL.WARNING, data, section);
    }

    static error(message, error, section, lineNumber) {
        log(LOG_LEVEL.ERROR, {
            'message': message,
            'error_obj': {
                name: error.name,
                message: error.message,
                stack: error.stack
            }
        }, section, lineNumber);
    }

    static critical(message, data = {}, section) {
        data.message = message;
        log(LOG_LEVEL.CRITICAL, data, section);
    }
}

function log(logLevel, data = {}, section, lineNumber) {

    if (window.ChaynsInfo && window.ChaynsInfo.LocationID) {
        data.locationId = window.ChaynsInfo.LocationID;
    }
    data.env = process.env.NODE_ENV;
    logs.push({
        "lineNumber": lineNumber,
        "section": section,
        "creationTime": Date.now(),
        "level": logLevel,
        "data": data
    });
    sendLogs(logLevel === LOG_LEVEL.ERROR || logLevel === LOG_LEVEL.CRITICAL);
}

function sendLogs(force = false) {
    try {
        if (timeOut !== null && !force) {
            return;
        }

        timeOut = setTimeout(() => {
            timeOut = null;

            if (logs.length > 0) {
                Request.post(`https://sub49.tobit.com/v0.1/Log/web`, logs, {
                    'X-ApplicationGuid': 'B150BF1E-A955-4073-B3DD-4F2CEC864C6A'
                });
            }

            logs = [];
        }, (force) ? 0 : 250);
    } catch (ex) {
        console.error('ex while sendLogs', ex);
    }
}