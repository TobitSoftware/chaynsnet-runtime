import {stringisEmptyOrWhitespace, getUrlParameters} from './helper';
import {htmlToElement, numberToTimeString} from './convert';
import classNames from 'classnames';

const password = 'cw913';

let locked = false,
    hidden = true,
    $consoleElement = null,
    $elementWrapper = null,
    $input = null;

export default class Console {
    static init() {
        if (getUrlParameters().console === '1') {
            createConsole();
            init();
            window.console.hide = Console.hide();
            window.console.clear = Console.clear();
        }
    }

    static show() {
        if ($consoleElement) {
            $consoleElement.classList.remove('hidden');
            log('>>> SHOWN');
        }
    }

    static hide() {
        if ($consoleElement) {
            $consoleElement.classList.add('hidden');
            log('>>> HIDDEN');
        }
    }

    static clear() {
        if ($elementWrapper) {
            $elementWrapper.innerHTML = '';
            log('>>> CLEARED');
        }
    }
}


function createConsole() {
    let classes = classNames('console', {
        hidden: hidden
    });

    $consoleElement = htmlToElement(`<div class="${classes}">
                                        <div class="console__element-wrapper"></div>
                                        <input class="input console__input">
                                    </div>`);

    $elementWrapper = $consoleElement.querySelector('.console__element-wrapper');
    $input = $consoleElement.querySelector('.console__input');

    document.body.appendChild($consoleElement);
}

function init() {
    let nativeLog = console.log;
    let customLog = (...messages) => {
        let content = '';
        for (let i = 0, l = messages.length; i < l; i++) {
            content += `${getLogText(messages[i])}${(i < l - 1) ? ', ' : ''}`;
        }

        log(content);

        try {
            nativeLog.apply(this, messages);
        } catch (ex) {
        }
    };

    window.console.log = customLog;

    window.console.debug = customLog;

    window.console.error = customLog;

    window.onerror = function (message, url, lineNumber) {
        let urlParts = url.split('/');
        let fileName = urlParts[urlParts.length - 1];
        customLog(`${message} (${fileName}:${lineNumber})`);
        return true;
    };

    $input.addEventListener('keypress', function (e) {
        if (e.keyCode === 13) {
            event.preventDefault();

            if (e.shiftKey) {
                this.value += ' \n';
                return false;
            }

            if (stringisEmptyOrWhitespace(this.value)) {
                return false;
            }

            if (this.value.indexOf('console.clear()') > -1) {
                console.clear();
                this.value = '';
                return false;
            }
            if (this.value.indexOf('console.hide()') > -1) {
                console.hide();
                this.value = '';
                return false;
            }

            if (locked) {
                if (this.value === password) {
                    locked = false;
                    log('>>> Console unlocked!');
                } else {
                    log('>>> Console locked! Unlock with Password!');
                }
                this.value = '';
                return false;
            }

            console.log(`>> ${this.value}`);
            let res = null;
            try {
                res = eval(this.value);
            } catch (ex) {
                res = ex.message;
            }
            console.log(res);
            this.value = '';
            $elementWrapper.scrollTop = $elementWrapper.scrollHeight;
            return false;
        }
    });
}

function log(text) {
    let now = new Date();
    let dateString = `${numberToTimeString(now.getHours())}:${numberToTimeString(now.getDate())}:${numberToTimeString(now.getSeconds())}`;

    let element = htmlToElement(`<div class="console__element">
                                    <div class="console__content">${text}</div>
                                    <div class="console__date">${dateString}</div>
                                </div>`);

    $elementWrapper.appendChild(element);
}

function getLogText(data) {
    if (data && typeof data === 'object') {
        return JSON.stringify(data, Object.getOwnPropertyNames(data));
    }
    return data;
}



