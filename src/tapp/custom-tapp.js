import logger from 'chayns-logger';
import htmlToElement from 'html-to-element';
import { chaynsInfo, setSelectedTapp } from '../chayns-info';
import { resetCallback } from '../json-chayns-call/calls/access-token-status-change';
import FloatingButton from '../ui/floating-button';
import WaitCursor from '../ui/wait-cursor';
import { getUrlParameters } from '../utils/url-parameter';
import { parameterStringToObject } from '../utils/convert';
import ConsoleLogger from '../utils/console-logger';
import { ChaynsHost, Environment, Font, Gender, getDeviceInfo, IconType, RuntimeEnviroment } from 'chayns-api';
import * as ReactDOM from 'react-dom';

const loggerLoadTappById = new ConsoleLogger('loadTappById(custom-tapp.js)');
const loggerLoadTapp = new ConsoleLogger('loadTapp(custom-tapp.js)');

const $bodyContent = document.querySelector('.body-content');

const PULL_TO_REFRESH_CALL_NUMBER = 0;
const OPEN_DIALOG_CALL_NUMBER = 184;
const CLOSE_DIALOG_CALL_NUMBER = 113;
const SHOW_TOAST_NOTIFICATION_CALL_NUMBER = 276;

let accessToken;
let callbackId = 0;

const mapOldApiToNew = ({ retVal }) => {
    const { AppInfo, AppUser } = retVal;
    accessToken = AppUser.TobitAccessToken;
    return {
        device: getDeviceInfo(navigator.userAgent, 'image/webp'),
        environment: {
            buildEnvironment: Environment.Production,
            runtimeEnvironment: RuntimeEnviroment.Unknown
        },
        language: {
            site: AppInfo.Language,
            translation: null,
            device: AppInfo.Language,
            active: AppInfo.Language
        }, // ToDo: Find better way to detect
        site: {
            id: AppInfo.SiteID,
            locationId: AppInfo.LocationID,
            url: window.location.href.split('#')[0],
            layoutDisposition: {
                contentWide: false,
                barOnTop: false,
                barWide: false,
                coverDetached: false,
                coverHidden: false,
                coverWide: false,
                docked: false
            },
            title: AppInfo.Title,
            colorMode: AppInfo.colorMode,
            color: AppInfo.color,
            domain: AppInfo.domain,
            font: {
                id: Font.Roboto,
                headlineFont: Font.Roboto,
                dynamicFontSize: false
            },
            dynamicFontSize: false,
            locationPersonId: AppInfo.LocationPersonId,
            urlHash: window.location.hash.replace('#', '')
        },
        parameters: [...new URLSearchParams(location.search)],
        user: {
            firstName: AppUser.FirstName,
            lastName: AppUser.LastName,
            gender: Gender.Unknown,
            userId: AppUser.TobitUserID,
            personId: AppUser.PersonID,
            uacGroups: []
        },
        customData: null,
        isAdminModeActive: AppUser.AdminMode,
        currentPage: {
            id: AppInfo.TappSelected && AppInfo.TappSelected.TappID,
            siteId: AppInfo.SiteID
        },
        pages: AppInfo.Tapps.map(x => ({
            id: x.TappID,
            icon: '',
            iconType: IconType.Font,
            customUrl: '',
            isExclusive: x.isExclusiveView,
            isHiddenFromMenu: x.isHiddenFromMenu,
            minAge: null,
            name: x.ShowName,
            sortId: x.SortUID
        }))
    }
}

export const invokeDialogCall = (call, callback) => {
    const callbackName = `cwCallback${callbackId}`;
    window[callbackName] = (e) => {
        callback(e && e.retVal);
    };
    if ([OPEN_DIALOG_CALL_NUMBER, PULL_TO_REFRESH_CALL_NUMBER, CLOSE_DIALOG_CALL_NUMBER,SHOW_TOAST_NOTIFICATION_CALL_NUMBER].includes(call.action)) {
        window.dialog.receiveApiCall({ ...call, value: { ...(call && call.value || {}), callback: `window.${callbackName}` } }, 'chayns.ajaxTab.jsoncall');
    }

    if (call.action === 218) {
        window.receiveIframeDialogMessage(call, true);
    }

    callbackId++;
};

/**
 * Loads Tapp by TappId.
 * @param {Number} tappId
 */
export default function loadTappById(tappId) {
    FloatingButton.hide();
    WaitCursor.hide();

    const tapp = getTappById(tappId);
    if (tapp) {
        setSelectedTapp(tapp);
        resetCallback();
        loadTapp(tapp.id, setUrlParams(tapp.url), tapp.postTobitAccessToken);
    } else {
        logger.warning({
            message: 'no tapp found',
            customNumber: tappId,
            fileName: 'custom-tapp.js',
            section: 'loadTapp'
        });
        loggerLoadTappById.warn('No Tapp found!');
    }
}

/**
 * Returns the tapp to tappId
 * @param tappId
 * @returns {*}
 */
export function getTappById(tappId) {
    return chaynsInfo.Tapps.find(tapp => tapp.id === tappId) || null;
}

/**
 * replaces url parameters with chayns env, removes double params, removes empty params, adds non system urlParameter from cnrt
 * @param {string} url
 * @returns {string} url
 */
function setUrlParams(url) {
    url = url.replace(/##apname##/ig, chaynsInfo.LocationName);
    url = url.replace(/##siteid##/ig, chaynsInfo.SiteID);
    url = url.replace(/##os##/ig, 'chaynsnet-runtime');
    url = url.replace(/##version##/ig, chaynsInfo.getGlobalData().AppInfo.Version);
    url = url.replace(/##colormode##/ig, chaynsInfo.ColorMode.toString());
    url = url.replace(/##color##/ig, chaynsInfo.Color.replace('#', ''));
    url = url.replace(/##adminmode##/ig, (chaynsInfo.AdminMode ? 1 : 0).toString());
    url = url.replace(/##tobituserid##/ig, chaynsInfo.User.ID.toString());

    if (chaynsInfo.User !== undefined && chaynsInfo.User.ID !== '' && chaynsInfo.User.ID > 0) {
        url = url.replace(/##firstname##/ig, chaynsInfo.User.FirstName);
        url = url.replace(/##lastname##/ig, chaynsInfo.User.LastName);
    }

    url = url.replace(/##.*?##/g, ''); // removes unused parameters

    const urlParam = Object.assign(getUrlParameters(false), parameterStringToObject(url));

    const paramString = Object.keys(urlParam).map(key => (urlParam[key] !== undefined ? `${key}=${urlParam[key]}` : key));
    const timeStamp = url.match(/(?:_=)\b(\d*)/i);

    return `${url.split('?')[0]}?${paramString.join('&')}${(!timeStamp) ? `&_=${Date.now()}` : ''}`;
}

/**
 * loads an url by tapp id and creates the iframe
 * @param {number} tappId
 * @param {string} tappUrl
 * @param {boolean} postTobitAccessToken
 */
function loadTapp(tappId, tappUrl, postTobitAccessToken) {
    if (typeof tappId !== 'number') {
        tappId = parseInt(tappId, 10);
        if (Number.isNaN(tappId)) {
            loggerLoadTapp.error('TappId is not a number');
            return;
        }
    }
    if (!tappUrl || typeof tappUrl !== 'string') {
        loggerLoadTapp.error('TappUrl is not a string');
        return;
    }

    if (tappId === 250357 || tappId === -2) {
        const url = new URL(tappId === 250357 ? 'https://tapp.chayns-static.space/wallet/v3/index.html' : 'https://tapp.chayns-static.space/chayns-id/v1/index.html');
        url.searchParams.set('siteId', chaynsInfo.SiteID);
        url.searchParams.set('colorMode', chaynsInfo.ColorMode);
        ReactDOM.render((
            <ChaynsHost
                type="client-iframe"
                src={url.toString()}
                iFrameProps={{
                    name: 'TappIframe',
                    id: 'TappIframe'
                }}
                {...mapOldApiToNew({ retVal: chaynsInfo.getGlobalData() })}
                functions={{
                    getAccessToken: () => ({accessToken: typeof chaynsInfo !== 'undefined' ? window.chaynsInfo.User.TobitAccessToken : chayns.env.user.tobitAccessToken}),
                    setFloatingButton: (data, callback) => {
                        // data.callback = callback;
                        // window.handleChaynsCalls('floatingButton', data);
                    },
                    storageSetItem: (key, value, accessMode, tappIds) => {
                        // return setKeyForTapp(key, value, accessMode, tappIds);
                    },
                    storageGetItem: (key, accessMode) => {
                        // return getKeyForTapp(key, accessMode);
                    },
                    storageRemoveItem: (key, accessMode) => {
                        // return removeKeyForTapp(key, accessMode);
                    },
                    invokeDialogCall: (value, callback) => {
                        console.log('test', value, callback);
                        invokeDialogCall(value, callback);
                    },
                    setWaitCursor: (v) => {
                        console.log('setWaitCursor', v)
                    }
                }}
            />
        ), $bodyContent);
        return;
    }

    const $input = htmlToElement(`<input id="ActiveTappID" name="ActiveTappID" type="hidden" value="${tappId}">`);

    const $form = htmlToElement(`<form action="${tappUrl}" target="TappIframe" method="get" id="TobitAccessTokenForm"></form>`);
    if (postTobitAccessToken && chaynsInfo.User.TobitAccessToken) {
        $form.setAttribute('method', 'post');
        const $hiddenField = document.createElement('input');
        $hiddenField.setAttribute('type', 'hidden');
        $hiddenField.setAttribute('name', 'TobitAccessToken');
        $hiddenField.setAttribute('value', chaynsInfo.User.TobitAccessToken);
        $form.appendChild($hiddenField);
    }

    const parameter = parameterStringToObject(tappUrl);
    for (const key of Object.keys(parameter)) {
        $form.appendChild(htmlToElement(`<input name="${key}" value="${parameter[key]}" type="hidden">`));
    }

    const $iframe = htmlToElement('<iframe frameborder="0" marginheight="0" marginwidth="0" id="TappIframe" name="TappIframe" allowpaymentrequest=""></iframe>');
    $iframe.style.height = `${(window.innerHeight - document.body.getBoundingClientRect().top) + document.body.scrollTop}px`;

    if (chaynsInfo.IsMobile) {
        $iframe.setAttribute('style', 'margin-top: -10px !important;');
    }

    if (chaynsInfo.ExclusiveMode || chaynsInfo.fullSizeMode) {
        $bodyContent.classList.add('body-content--exclusive-view');
    } else {
        $bodyContent.classList.remove('body-content--exclusive-view');
    }
    $form.action = `${$form.action}&contentWidth=${$bodyContent.offsetWidth}`;


    $bodyContent.innerHTML = '';
    $bodyContent.appendChild($input);
    $bodyContent.appendChild($form);
    $bodyContent.appendChild($iframe);


    if ($form.length > 0) {
        $form.submit();
    }
}
