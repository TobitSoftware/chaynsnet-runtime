import {htmlToElement, argbHexToRgba, numberToTimeString} from './utils/convert';
import {styleNames} from './utils/helper';
import classNames from 'classnames';

import TimePicker from './date-time-dialog/time-picker';

let dialogs = {
        alert,
        confirm,
        select,
        date,
        time,
        dateTime,
        input
    },
    buttonTypes = {
        CANCEL: -1,
        NEGATIVE: 0,
        POSITIVE: 1
    },
    currentDialog = null,
    currentType = null;

export default class Dialog {

    static show(type, config) {
        if (currentDialog) {
            Dialog.hide();
        }

        currentDialog = dialogs[type](config);
        currentType = type;

        document.body.appendChild(currentDialog);
    }

    static hide() {
        document.body.removeChild(currentDialog);
        currentDialog = null;
    }
}

function alert(config) {
    return getDialog(config.title, config.message, null, null, getButtonWrapper(config));
}

function date(config) {

}

function time(config) {
    let $contentWrapper = htmlToElement(`<div class="dialogContentWrapper"></div>`);

    let timePicker = new TimePicker(config);

    $contentWrapper.appendChild(timePicker.element);

    return getDialog(config.title, config.message, null, $contentWrapper, getButtonWrapper(config));
}

function dateTime(config) {

}

function input(config) {
    let styles = styleNames({
        "margin-bottom": "20px",
        "width": "95%"
    });

    let $contentWrapper = htmlToElement(`<div class="dialogContentWrapper">
                                            <textarea class="input" 
                                                      id="dlgInput"
                                                      autogrow="true" 
                                                      style=${styles}
                                                      placeholder="${(config.placeholderText != null) ? config.placeholderText : 'Schreibe etwas...'}"></textarea>
                                         </div>`);

    return getDialog(config.title, config.message, null, $contentWrapper, getButtonWrapper(config));
}

function select(config) {
    let $contentWrapper = htmlToElement(`<div class="dialogItemList"></div>`);
    let $list = htmlToElement('<div></div>');

    for (let i = 0, l = config.list.length; i < l; i++) {
        let $listItem = '';
        let icon = null;
        let image = null;
        let classes = classNames(
            'ChaynsCS-Border-30Pcnt',
            'dialogItem',
            {
                'ChaynsCS-BgColor-20Pcnt': config.list[i].isSelected
            }
        );

        if (typeof config.list[i].image === 'string') {
            image = `<div class="itemImg"><img src="${config.list[i].image}" onerror="this.style.display = 'none'" alt="" /></div>`;
        }

        if (config.list[i].icon) {
            const rgba = argbHexToRgba(config.list[i].icon.color);
            let styles = styleNames({
                'font-size': '20px',
                'width': '25px',
                'color': {
                    'rgba(`${rgba.r},${rgba.g},${rgba.b},${rgba.a}`)': rgba !== null
                }
            });

            icon = rgba == null ? `<span style=${styles} class="ChaynsCS-Color fa ${item.Icon.name}"></span>` : `<span style=${styles} class="fa ${item.Icon.name}"></span>`;
        }

        $listItem = htmlToElement(`<div class="${classes}" data-selected="${config.list[i].isSelected || false}" data-selected-name="${config.list[i].name}" data-selected-value=${JSON.stringify(config.list[i].value)}>
                                        ${image !== null ? image : ''}
                                        ${icon !== null ? icon : ''}
                                        <div title="${config.list[i].name}">${config.list[i].name}</div>
                                    </div>`);

        $listItem.addEventListener('click', () => {
            switch (config.selection) {
                case 2:
                    break;
                case 0:
                    $listItem.classList.toggle('ChaynsCS-BgColor-20Pcnt');
                    $listItem.setAttribute('data-selected', 'true');

                    executeCallback(config, 1);

                    break;
                default:
                    if (!config.multiselect) {
                        let $items = document.querySelectorAll('.dialogItem');

                        for (let i = 0, l = $items.length; i < l; i++) {
                            $items[i].classList.remove('ChaynsCS-BgColor-20Pcnt');
                            $items[i].setAttribute('data-selected', 'false');
                        }

                        $listItem.classList.toggle('ChaynsCS-BgColor-20Pcnt');
                        $listItem.setAttribute('data-selected', 'true');

                        executeCallback(config, 1);

                        break;
                    }

                    $listItem.classList.toggle('ChaynsCS-BgColor-20Pcnt');

                    if ($listItem.getAttribute('data-selected') === 'false') {
                        $listItem.setAttribute('data-selected', 'true');
                    } else {
                        $listItem.setAttribute('data-selected', 'false');
                    }

                    break;
            }
        });

        $list.appendChild($listItem);
    }

    $contentWrapper.appendChild($list);

    return getDialog(config.title, config.message, config.quickfind, $contentWrapper, getButtonWrapper(config));
}

function quickFind() {
    let $items = document.querySelectorAll('.dialogItem');
    let $input = document.querySelector('.dialogQuickfind');

    for (let i = 0, l = $items.length; i < l; i++) {
        if ($items[i].getAttribute('data-selected-name').toLocaleLowerCase().indexOf($input.value) === -1) {
            $items[i].classList.add('hidden');
            $items[i].setAttribute('data-selected', 'false');
            $items[i].classList.remove('ChaynsCS-BgColor-20Pcnt');
        } else {
            $items[i].classList.remove('hidden');
        }
    }
}

function getButtonWrapper(config) {
    if (!config || !config.buttons) {
        config.buttons = [{
            text: 'OK',
            buttonType: buttonTypes.POSITIVE
        }]
    }

    let $btnWrapper = document.createElement('div');
    $btnWrapper.classList.add('btnWrapper');

    for (let button of config.buttons) {
        let icon = '';

        if (button.icon) {
            let rgba = argbHexToRgba(button.icon.color) || {
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

        let $currentBtn = htmlToElement(`<div class="chaynsBtn wide">${icon} ${button.text}</div>`);
        $currentBtn.addEventListener('click', () => executeCallback(config, button.buttonType));
        $btnWrapper.appendChild($currentBtn);
    }
    return $btnWrapper;
}

function executeCallback(config, buttonType) {
    let ret = {
        buttonType
    };

    let $items = document.querySelectorAll('.dialogItem');

    switch (currentType) {
        case 'alert':
            break;
        case 'time':
            let hours = document.querySelector('#timePicker #picker__hours').value;
            let minutes = document.querySelector('#timePicker #picker__minutes').value;
            let date = new Date();
            date.setHours(hours);
            date.setMinutes(minutes);
            date.setSeconds(0);
            date.setMilliseconds(0);
            console.debug('js:', date.getTime(), '/1000:', date.getTime() / 1000);
            ret.selectedDate = date.getTime() / 1000;
            break;
        case 'input':
            ret.text = currentDialog.querySelector('#dlgInput').value || '';
            break;
        case 'facebook':
            ret = $items.filter(function (x) {
                return x.getAttribute('data-selected') === 'true';
            });
            break;
        case 'select':
            ret.selection = [];

            for (let i = 0, l = $items.length; i < l; i++) {
                if ($items[i].getAttribute('data-selected') === 'true') {
                    ret.selection.push({
                        name: $items[i].getAttribute('data-selected-name'),
                        value: $items[i].getAttribute('data-selected-value')
                    });
                }
            }

            break;
        default:
    }

    if (config.selection === 0 && config.list && config.list.length > 0) {
        let $item = document.querySelector(`.dialogItem[data-selected='true']`);

        let filtered = config.list.filter(function (x) {
            return x.name === $item.getAttribute('data-selected-name')
        });

        ret = filtered[0];
        ret.type = currentType;
    }

    Dialog.hide();

    if (typeof config.callback === 'function') {
        config.callback(ret);
    }
}

function getDialog(headline, description, quickfind, contentWrapper, buttonWrapper) {
    headline = headline ? headline : '';
    description = description ? description : '';

    let dialog = htmlToElement(`<div class="dialogBackgroundLayer">
                            <div class="dialogBody">
                                ${(headline) ? `<h1>${headline}</h1>` : ''}
                                ${(description) ? `<div class="dialogDescription">${description}</div>` : ''}           
                             </div>
                           </div>`);

    if (quickfind) {
        let $search = htmlToElement(`<input class="dialogQuickfind ChaynsCS-Color" placeholder="Suchen" />`);

        $search.addEventListener('input', () => quickFind());

        dialog.firstElementChild.appendChild($search);
    }

    if (contentWrapper) {
        dialog.firstElementChild.appendChild(contentWrapper);
    }

    if (buttonWrapper) {
        dialog.firstElementChild.appendChild(buttonWrapper);
    }

    return dialog;
}