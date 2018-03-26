const LEVELS = {
    NONE: 0,
    ERROR: 1,
    WARNING: 2,
    INFO: 3,
    DEBUG: 4,
};

const logger = window.console;
let logLevel = LEVELS.ERROR;

/**
 *
 * @param { String } level
 * @param { Array } args
 * @param { String } name
 */
function log(level, args, name) {
    try {
        if (logger[level]) {
            logger[level](name, ...args);
        } else {
            logger.log(name, level, ...args);
        }
    } catch (ex) {
        console.error('ConsoleLogger-Error', ex);
    }
}

export default class ConsoleLogger {

    constructor(name) {
        this.name = `[${name || 'cnrt'}]`;
    }

    static LEVELS = LEVELS;

    static setLevel(level) {
        logLevel = level;
    }

    debug = (...args) => {
        if (logLevel < LEVELS.DEBUG) {
            return;
        }
        log('debug', args, this.name);
    };

    info = (...args) => {
        if (logLevel < LEVELS.INFO) {
            return;
        }
        log('info', args, this.name);
    };

    warn = (...args) => {
        if (logLevel < LEVELS.WARNING) {
            return;
        }
        log('warn', args, this.name);
    };

    error = (...args) => {
        if (logLevel < LEVELS.ERROR) {
            return;
        }
        log('error', args, this.name);
    };
}
