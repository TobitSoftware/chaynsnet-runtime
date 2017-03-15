import htmlToElement from 'html-to-element';
import { chaynsInfo } from '../chayns-info';
import ConsoleLogger from '../utils/console-logger';
import { getRelativeColor } from '../utils/convert';

const consoleLogger = new ConsoleLogger('(dynamic-styles.js)');

/**
 * Accept Arrays like
 *
 * [{
 *   selector: '.abc::before', styles: {
 *      prop1: 'value',
 *      prop2: 'value'
 *   }
 * }]
 *
 * @param classArray
 */
function addStyle(classArray) {
    let css = '';
    for (const cssClass of classArray) {
        let body = '';
        for (const style of Object.keys(cssClass.styles)) {
            body += `\n\t${style}:${cssClass.styles[style]};`;
        }
        if (body.length > 0) {
            css += `\n${cssClass.selector}{${body}\n}`;
        }
    }
    document.head.appendChild(htmlToElement(`<style type="text/css">${css}</style>`));
}

export async function setDynamicStyle() {
    try {
        const getColor = (percentage, opacity) => getRelativeColor(chaynsInfo.Color, percentage, opacity);

        const chaynsCss = document.querySelector('link[href^="https://chayns-res.tobit.com/API/"]');
        const chaynsCssColor = htmlToElement(`<link rel="stylesheet" href="${chaynsCss.href}?color=${getColor(100).substr(1, 6)}">`);
        if (chaynsCss) {
            document.head.insertBefore(chaynsCssColor, chaynsCss);
            document.head.removeChild(chaynsCss);
        }

        // Body
        addStyle([{
            selector: 'body',
            styles: {
                'background-color': getColor(7)
            }
        }, {
            selector: 'h1',
            styles: {
                color: getColor(100)
            }
        }]);

        // Dialog
        addStyle([{
            selector: '.chaynsBtn',
            styles: {
                'background-color': getColor(100)
            }
        }, {
            selector: '.chaynsBtn:hover',
            styles: {
                'background-color': getColor(100, 0.6)
            }
        }]);

        // WaitCursor
        addStyle([{
            selector: '.ChaynsLoadingCursor > .loading-spinner-wrapper',
            styles: {
                'background-color': getColor(100, 0.25)
            }
        }, {
            selector: '.ChaynsLoadingCursor.with-text > .loading-spinner-wrapper',
            styles: {
                'background-color': `${getColor(25, 0.9)}!important`
            }
        }, {
            selector: '.loading-spinner',
            styles: {
                'border-color': `${getColor(100, 0.8)}!important`
            }
        }]);

        // .ChaynsCS-*
        addStyle([{
            selector: '.ChaynsCS-Border-30Pcnt',
            styles: {
                'border-color': getColor(30)
            }
        }, {
            selector: '.ChaynsCS-BgColor-20Pcnt',
            styles: {
                'background-color': `${getColor(20)}!important`
            }
        }, {
            selector: '.ChaynsCS-BgColor',
            styles: {
                'background-color': `${getColor(100)}!important`
            }
        }, {
            selector: '.ChaynsCS-Color',
            styles: {
                color: `${getColor(100)}!important`
            }
        }]);
    } catch (e) {
        consoleLogger.error(e);
    }
}
