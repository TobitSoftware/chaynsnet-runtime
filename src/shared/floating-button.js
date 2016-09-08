import {htmlToElement} from './utils/convert';
import classNames from 'classnames';

let floatingBtnCfg = {};

export default class FloatingButton {
    /**
     * display or create a FloatingButton for the srcIframe
     * @param text
     * @param srcIframe
     * @param bgColor
     * @param color
     */
    static show = (text, srcIframe, bgColor, color)=> {
        if (!srcIframe || srcIframe === window) {
            srcIframe = document.querySelector('#CustomTappIframe');
            if (!srcIframe) {
                srcIframe = document.querySelector('#BodyContent');
                srcIframe.name = 'default';
            }
        }

        let config = floatingBtnCfg[srcIframe.name] || {};

        if (!config.$floatingButton) {
            config.$floatingButton = getFloatingButton(srcIframe.name);
            config.$floatingButton.addEventListener('click', (e)=> {
                JsonCalls.Helper.DispatchJsonCallEvent(72);
                e.stopPropagation()
            });
            srcIframe.parentElement.parentElement.appendChild(config.$floatingButton);
        }
        config.$floatingButton.innerHTML = text;
        config.$floatingButton.style.backgroundColor = bgColor;
        config.$floatingButton.style.color = color;


        config.$floatingButton.classList.remove('hidden');
        floatingBtnCfg[srcIframe.name] = config;
    };

    /**
     * hide the FloatingButton of the srcIframe
     * @param srcIframe
     */
    static hide = (srcIframe) => {
        if (!srcIframe || srcIframe === window) {
            let defaultWaitCursor = document.querySelector('.floatingButton[data-iframe="default"]');
            if (defaultWaitCursor) {
                defaultWaitCursor.parentElement.removeChild(defaultWaitCursor);
                floatingBtnCfg['default'] = undefined;
                return;
            }
            srcIframe = document.querySelector('#CustomTappIframe');
        }

        let config = (srcIframe) ? floatingBtnCfg[srcIframe.name] || null : null;
        if (!config || !config.$floatingButton) {
            return;
        }
        config.$floatingButton.classList.add('hidden');
    };
}

/**
 * returns a FloatingButton node
 * @param frameName
 * @returns {*}
 */
function getFloatingButton(frameName) {

    let classes = classNames('floatingButton', 'hidden', {
        'chayns-id': (frameName === 'ChaynsIDFrame'),
        'menu-right': window.ChaynsInfo.Webshadow.MenuPosition === 1,
        'menu-left': window.ChaynsInfo.Webshadow.MenuPosition === 0,
        'is-mobile': window.ChaynsInfo.IsMobile
    });
    return htmlToElement(`<div class="${classes}" data-iframe="${frameName}"></div>`);
}