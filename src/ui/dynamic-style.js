import htmlToElement from 'html-to-element';
import { chaynsInfo } from '../chayns-info';
import ConsoleLogger from '../utils/console-logger';
import { getRelativeColor, mixColors } from '../utils/convert';
import { getUrlParameters } from '../utils/url-parameter';
import { CACHE_VERSION } from '../constants/version';

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

export default async function setDynamicStyle() {
    try {
        const getColor = (percentage, opacity) => getRelativeColor(chaynsInfo.Color, percentage, opacity);

        const chaynsCss = htmlToElement(`<link rel="stylesheet" href="https://api.chayns.net/css/v4.2/?siteid=${chaynsInfo.SiteID}&cacheversion=${CACHE_VERSION}">`);
        const dialogCss = htmlToElement(`<link rel="stylesheet" href="https://chayns-res.tobit.com/API/v3.1/dialog/css/dialog.css?cacheversion=${CACHE_VERSION}">`);
        const fontAwesomeCss = htmlToElement('<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">');

        document.head.appendChild(chaynsCss);
        document.head.appendChild(dialogCss);
        document.head.appendChild(fontAwesomeCss);

        const customBackgroundColor = getUrlParameters().backgroundcolor && getUrlParameters().backgroundcolor.match(/^#?[0-9A-Fa-f]{3,8}$/g) && `#${getUrlParameters().backgroundcolor.replace('#', '')}`;
        const customOverflow = getUrlParameters().overflow;

        if (customOverflow) {
            addStyle([{
                selector: 'chayns--mobile',
                styles: {
                    overflow: `${customOverflow} !important`
                }
            }]);
        }

        // Body
        const colorModeBaseColors = {
            0: '#ffffff',
            1: '#1a1a1a',
        };
        addStyle([{
            selector: 'body',
            styles: {
                'background-color': customBackgroundColor || (chaynsInfo.ColorMode === 2 ? '#ffffff' : mixColors(chaynsInfo.Color, colorModeBaseColors[chaynsInfo.ColorMode], 7)),
                overflow: customOverflow || ''
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
        }, {
            selector: '.ChaynsCS-Color-80Pcnt',
            styles: {
                color: `${getColor(80)}!important`
            }
        }]);
    } catch (e) {
        consoleLogger.error(e);
    }
}
