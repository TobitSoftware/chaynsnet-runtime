import htmlToElement from 'html-to-element';
import { argbHexToRgba } from '../../utils/convert';
import Fade from '../../utils/fade';
import getDefer from '../../utils/defer';

import TimePicker from './time-picker/time-picker';
import DatePicker from './date-picker/date-picker';
import InputDialog from './input-dialog/input-dialog';
import SelectDialog from './select-dialog/select-dialog';

let dialogs = {
        alert,
        select,
        date,
        time,
        dateTime,
        input
    },
    $currentDialog = null,
    currentType = null,
    currentInstances = null,
    promise = null;

export default class Dialog {

    /**
     * Displays an Dialog.
     * @param {number} type - Dialog.buttonType.*
     * @param {Object} config
     * @returns {Promise} - {buttonType: number, ...}
     */
    static show(type, config) {
        promise = getDefer();
        if ($currentDialog) {
            return Dialog.hide().then(() => Dialog.show(type, config));
        }

        currentInstances = {};
        currentType = type;
        $currentDialog = dialogs[type](config);

        $currentDialog.classList.add('fade-out');
        document.body.appendChild($currentDialog);
        setTimeout(() => Fade.in($currentDialog), 1);
        return promise.promise;
    }

    /**
     * Closes the active Dialog.
     * @returns {Promise}
     */
    static hide(buttonType) {
        if (!$currentDialog) {
            return Promise.resolve();
        }

        promise.resolve(getResultObj((buttonType === undefined) ? Dialog.buttonType.CANCEL : buttonType));

        return Fade.out($currentDialog).then(() => {
            if (!$currentDialog) {
                return Promise.resolve();
            }

            document.body.removeChild($currentDialog);
            $currentDialog = null;
        });
    }

    /**
     * ButtonType Enums.
     * @readonly
     * @enum {number}
     */
    static buttonType = {
        CANCEL: -1,
        NEGATIVE: 0,
        POSITIVE: 1
    };

    /**
     * Dialog Type Enums
     * @readonly
     * @enum {number}
     */
    static type = {
        ALERT: 'alert',
        SELECT: 'select',
        DATE: 'date',
        TIME: 'time',
        DATETIME: 'dateTime',
        INPUT: 'input'
    }
}

/**
 * Creates alert Dialog.
 * @param {Object} config
 * @param {?string} config.title
 * @param {?string} config.message
 * @param {?Object} config.buttons
 * @returns {HTMLElement} DOM-Element
 */
function alert(config) {
    return getDialog(config.title, config.message, null, null, getButtonWrapper(config.buttons));
}

/**
 * Creates date Dialog.
 * @param {Object} config
 * @param {?string} config.title
 * @param {?string} config.message
 * @param {?Object} config.buttons
 * @param {number} config.maxDate - Timestamp UTC in Seconds
 * @param {number} config.minDate - Timestamp UTC in Seconds
 * @param {number} config.selectedDate - Timestamp UTC in Seconds
 * @returns {HTMLElement} DOM-Element
 */
function date(config) {
    config.maxDate *= 1000;
    config.minDate *= 1000;
    config.selectedDate *= 1000;
    currentInstances.datePicker = new DatePicker(config);


    return getDialog(config.title, config.message, null, currentInstances.datePicker.element, getButtonWrapper(config.buttons));
}

/**
 * Creates time Dialog.
 * @param {Object} config
 * @param {?string} config.title
 * @param {?string} config.message
 * @param {?Object} config.buttons
 * @param {number} config.maxDate - Timestamp UTC in Seconds
 * @param {number} config.minDate - Timestamp UTC in Seconds
 * @param {number} config.selectedDate - Timestamp UTC in Seconds
 * @returns {HTMLElement} DOM-Element
 */
function time(config) {
    config.maxDate *= 1000;
    config.minDate *= 1000;
    config.selectedDate *= 1000;
    currentInstances.timePicker = new TimePicker(config);

    return getDialog(config.title, config.message, null, currentInstances.timePicker.element, getButtonWrapper(config.buttons));
}

/**
 * Creates dateTime Dialog.
 * @param {Object} config
 * @param {?string} config.title
 * @param {?string} config.message
 * @param {?Object} config.buttons
 * @param {number} config.maxDate - Timestamp UTC in Seconds
 * @param {number} config.minDate - Timestamp UTC in Seconds
 * @param {number} config.selectedDate - Timestamp UTC in Seconds
 * @returns {HTMLElement} DOM-Element
 */
function dateTime(config) {
    config.maxDate *= 1000;
    config.minDate *= 1000;
    config.selectedDate *= 1000;

    currentInstances.timePicker = new TimePicker(config);
    currentInstances.datePicker = new DatePicker(config, date => currentInstances.timePicker.updateSelectedDate(date));

    currentInstances.timePicker.updateSelectedDate(currentInstances.datePicker.dayPicker.selectedDate);

    const $content = [currentInstances.datePicker.element, currentInstances.timePicker.element];
    return getDialog(config.title, config.message, null, $content, getButtonWrapper(config.buttons));
}

/**
 * Creates input Dialog.
 * @param {Object} config
 * @param {?string} config.title
 * @param {?string} config.message
 * @param {?Object} config.buttons
 * @returns {HTMLElement} DOM-Element
 */
function input(config) {
    currentInstances.inputDialog = new InputDialog(config);

    return getDialog(config.title, config.message, null, currentInstances.inputDialog.element, getButtonWrapper(config.buttons));
}

/**
 * Creates input Dialog.
 * @param {Object} config
 * @param {?string} config.title
 * @param {?string} config.message
 * @param {?Object} config.buttons
 * @param {boolean} config.multiselect
 * @param {boolean} config.quickfind
 * @param {Object[]} config.list
 * @param {string} config.list[].name
 * @param {*} config.list[].value
 * @param {boolean} config.list[].isSelected
 * @param {string} config.list[].image
 * @param {Object} config.list[].icon
 * @param {string} config.list[].icon.color
 * @param {string} config.list[].icon.name
 * @returns {HTMLElement} DOM-Element
 */
function select(config) {
    currentInstances.selectDialog = new SelectDialog(config, () => {
        Dialog.hide(Dialog.buttonType.POSITIVE);
    });

    return getDialog(config.title, config.message, (config.quickfind) ? currentInstances.selectDialog.search : undefined, currentInstances.selectDialog.element, getButtonWrapper(config.buttons), currentInstances.selectDialog.lazyLoad);
}

/**
 * Returns the result object.
 * @param {number} buttonType - Enum(Dialog.buttonType)
 * @returns {{buttonType: number, ...}}
 */
function getResultObj(buttonType) {
    const ret = {
        buttonType
    };

    if (buttonType != Dialog.buttonType.CANCEL) {
        switch (currentType) {
            case 'alert':
                break;
            case 'date':
                ret.selectedDate = (currentInstances.datePicker.selectedDate.getTime() / 1000).toFixed(0);
                break;
            case 'time':
                const time = new Date();
                time.setHours(currentInstances.timePicker.hours);
                time.setMinutes(currentInstances.timePicker.minutes);
                time.setSeconds(0);
                ret.selectedDate = (time.getTime() / 1000).toFixed(0);
                break;
            case 'dateTime':
                const date = currentInstances.datePicker.selectedDate;
                date.setHours(currentInstances.timePicker.hours);
                date.setMinutes(currentInstances.timePicker.minutes);
                date.setSeconds(0);
                ret.selectedDate = (date.getTime() / 1000).toFixed(0);
                break;
            case 'input':
                ret.text = currentInstances.inputDialog.value;
                break;
            case 'select':
                ret.selection = currentInstances.selectDialog.selection;
                break;
            default:
        }
    } else {
        switch (currentType) {
            case 'alert':
                break;
            case 'date':
            case 'time':
            case 'dateTime':
                ret.selectedDate = -1;
                break;
            case 'input':
                break;
            case 'select':
                ret.selection = [];
                break;
            default:
        }
    }
    return ret;
}

/**
 * Returns
 * @param {?Object[]} buttons
 * @param {string} buttons[].text
 * @param {number} buttons[].buttonType - Enum(Dialog.buttonType)
 * @param {Object} buttons[].icon
 * @param {string} buttons[].icon.name
 * @param {number} buttons[].icon.size - px
 * @param {?string} buttons[].icon.color
 * @returns {HTMLElement} buttonWrapper
 */
function getButtonWrapper(buttons) {
    if (!buttons) {
        buttons = [{
            text: 'OK',
            buttonType: Dialog.buttonType.POSITIVE
        }];
    }

    const $btnWrapper = document.createElement('div');
    $btnWrapper.classList.add('dialog__buttons');

    for (const button of buttons) {
        let icon = '';

        if (button.icon) {
            const rgba = argbHexToRgba(button.icon.color) || {
                    r: 255,
                    g: 255,
                    b: 255,
                    a: 1
                };

            icon = `<span style="font-size:${button.icon.size}px;
                                 color: rgba(${rgba.r},${rgba.g},${rgba.b},${rgba.a});"
                                 class="icon fa ${button.icon.name}">
                    </span>)`;
        }

        const $currentBtn = htmlToElement(`<div class="button">${icon} ${button.text}</div>`);
        $currentBtn.addEventListener('click', () => Dialog.hide(button.buttonType));
        $btnWrapper.appendChild($currentBtn);
    }
    return $btnWrapper;
}

/**
 *
 * @param {?string} headline
 * @param {?string} description
 * @param {Function} quickFind - is executed when input
 * @param {(Element|Element[])} $content
 * @param {Element} $buttonWrapper
 * @param {Function} lazyLoad
 * @returns {HTMLElement}
 */
function getDialog(headline, description, quickFind, $content, $buttonWrapper, lazyLoad = null) {
    headline = headline || '';
    description = description || '';

    const $dialog = htmlToElement(`<div class="dialog__background-layer">
                            <div class="dialog"></div>
                           </div>`);

    $dialog.addEventListener('click', e => e.stopPropagation());

    if (headline || description || quickFind) {
        const $header = htmlToElement(`<div class="dialog__header">
                                        ${(headline) ? `<div class="ChaynsCS-Color headline">${headline}</div>` : ''}
                                        ${(description) ? `<div class="description">${description}</div>` : ''}
                                    </div>`);

        if (quickFind) {
            const $search = htmlToElement('<input class="search input" placeholder="Suchen" />');

            $search.addEventListener('input', () => quickFind($search.value));

            $header.appendChild($search);
        }

        $dialog.firstElementChild.appendChild($header);
    }

    if ($content) {
        const $wrapper = htmlToElement('<div class="dialog__content"></div>');

        if ($content.length != undefined) {
            for (const $element of $content) {
                $wrapper.appendChild($element);
            }
        } else {
            $wrapper.appendChild($content);
        }

        if (lazyLoad) {
            $wrapper.addEventListener('scroll', () => lazyLoad($wrapper));
        }

        $dialog.firstElementChild.appendChild($wrapper);
    }

    if ($buttonWrapper) {
        $dialog.firstElementChild.appendChild($buttonWrapper);
    }

    return $dialog;
}
