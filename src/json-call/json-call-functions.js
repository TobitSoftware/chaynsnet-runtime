import Dialog from '../ui/dialog';
import WaitCursor from '../ui/wait-cursor';
import FloatingButton from '../ui/floating-button';
import { argbHexToRgba } from '../utils/convert';
import { getWindowMetrics } from '../utils/helper';
import { loadTapp } from '../tapp/custom-tapp';
import { setAccessToken, closeWindow, refreshChaynsIdIcons } from '../utils/native-functions';
import { login, logout } from '../login';
import * as jsonCallHelper from './json-call-helper';
import { answerJsonCall } from '../tapp/custom-tapp-communication';
import {chaynsInfo} from '../chaynsInfo';

let dateType = {
    DATE: 1,
    TIME: 2,
    DATE_TIME: 3
};

export function toggleWaitCursor(value, srcIframe) {
    if (value.enabled) {
        WaitCursor.show(value.timeout, value.text, srcIframe[0]);
        return;
    }
    WaitCursor.hide(srcIframe[0]);
}

export function selectTab (value, srcIframe) {
    FloatingButton.hide(srcIframe[0]);

    loadTapp(value.id);
}

export function externOpenUrl (value) {
    window.open(value.url, value.target ? value.target : '_blank');
}

export function requestGeoLocation (value, srcIframe) {
    if (navigator.geolocation) {
        const requestPos = (method) => method.apply(navigator.geolocation, [
            function (pos) {
                const obj = {
                    'accuracy': pos.coords.accuracy,
                    'altitude': pos.coords.altitude,
                    'altitudeAccuracy': pos.coords.altitudeAccuracy,
                    'heading': pos.coords.heading,
                    'latitude': pos.coords.latitude,
                    'longitude': pos.coords.longitude,
                    'speed': pos.coords.speed
                };
                answerJsonCall(value, obj, srcIframe);
            }, function (err) {
                jsonCallHelper.throwEvent(14, err.code + 10, err.message, value, srcIframe);
            }
        ]);

        //noinspection JSUnresolvedVariable
        if (value.permanent) {
            jsonCallHelper.GeoWatchNumber = requestPos(navigator.geolocation.watchPosition);
        } else {
            if (jsonCallHelper.GeoWatchNumber !== null) {
                navigator.geolocation.clearWatch(jsonCallHelper.GeoWatchNumber);
                jsonCallHelper.GeoWatchNumber = null;
            } else {
                requestPos(navigator.geolocation.getCurrentPosition);
            }
        }
    } else {
        jsonCallHelper.throwEvent(14, 10, 'Position unavailable', value, srcIframe);
    }
}

export function showDialogAlert (value, srcIframe) {
    if (value.dialog === undefined) {
        jsonCallHelper.throwEvent(16, 2, 'Field dialog missing.', value, srcIframe);
        return;
    }
    if ((value.dialog.buttons || []).length === 0) {
        jsonCallHelper.throwEvent(16, 2, 'Field dialog.buttons missing.', value, srcIframe);
        return;
    }

    value.dialog.callback = (buttonType) => answerJsonCall(value, buttonType, srcIframe);

    Dialog.show('alert', value.dialog);
}

export function getGlobalData (value, srcIframe) {
    let data = ChaynsInfo.getGlobalData();
    answerJsonCall(value, data, srcIframe);
}

export function dateTimePicker (value, srcIframe) {
    if (!value.dialog) {
        value.dialog = {}
    }

    value.dialog.selectedDate = (value.selectedDate === -1) ? null : value.selectedDate;
    value.dialog.minDate = (value.minDate === -1) ? null : value.minDate;
    value.dialog.maxDate = (value.maxDate === -1) ? null : value.maxDate;
    value.dialog.callback = (ret) => answerJsonCall(value, ret, srcIframe);

    let dialogType;
    switch (value.type) {
        case dateType.DATE_TIME:
            dialogType = 'dateTime';
            break;
        case dateType.DATE:
            dialogType = 'date';
            break;
        case dateType.TIME:
            dialogType = 'time';
            break;
        default:
            dialogType = 'dateTime';
    }

    Dialog.show(dialogType, value.dialog);
}

export function multiSelectDialog (value, srcIframe) {
    if (value.dialog === undefined) {
        jsonCallHelper.throwEvent(50, 2, 'Field dialog missing.', value, srcIframe);
        return;
    }
    if ((value.dialog.buttons || []).length === 0) {
        jsonCallHelper.throwEvent(50, 2, 'Field dialog.buttons missing.', value, srcIframe);
        return;
    }
    if ((value.list || []).length === 0) {
        jsonCallHelper.throwEvent(50, 2, 'Field list missing.', value, srcIframe);
        return;
    }

    value.dialog.list = value.list;
    value.dialog.callback = (retVal) => answerJsonCall(value, retVal, srcIframe);

    Dialog.show('select', value.dialog);
}

export function tobitWebTokenLogin (value) {
    if ('tobitAccessToken' in value) {
        setAccessToken(value.tobitAccessToken);
        closeWindow();
        location.reload();
    }
}

export function tobitLogin () {
    login();
}

export function tobitLogout () {
    logout();
}

export function showFloatingButton (value, srcIfame) {
    if (value.enabled) {
        let bgColor = argbHexToRgba(value.color);
        bgColor = bgColor ? `rgba(${bgColor.r}, ${bgColor.g}, ${bgColor.b}, ${bgColor.a})` : '';
        //noinspection JSUnresolvedVariable
        let color = argbHexToRgba(value.colorText);
        color = color ? `rgba(${color.r}, ${color.g}, ${color.b}, ${color.a})` : '';
        let text;
        if ('text' in value) {
            text = value.text;
        } else if ('icon' in value) {
            text = `<span class='fa ${value.icon}'></span>`;
        } else {
            text = '!';
        }

        let callback = window.CustomTappCommunication.AnswerJsonCall.bind(undefined, value, null, srcIfame);

        FloatingButton.show(text, srcIfame[0], bgColor, color, callback);
    } else {
        FloatingButton.hide(srcIfame[0]);
    }
}

export function addChaynsCallErrorListener (value, srcIframe) {
    jsonCallHelper.AddJsonCallEventListener(75, value, srcIframe);
}

export function setIframeHeigth (value, srcIframe) {
    let $iframe = srcIframe[0];

    if (!value.full && !('height' in value) && !('fullViewport' in value)) {
        jsonCallHelper.throwEvent(77, 2, 'Field height missing.', value, srcIframe);
        return;
    } else if (value.full || value.fullViewport) {
        value.height = getWindowMetrics().AvailHeight;
        document.body.classList.add('no-scroll');
    } else {
        value.height = parseInt(value.height, 10);
        document.body.classList.remove('no-scroll');
    }

    if (isNaN(value.height)) {
        jsonCallHelper.throwEvent(77, 1, 'Field heigth is not typeof number', value, srcIframe);
        return;
    }

    value.growOnly = value.growOnly !== false; // true als default

    if ($iframe && (!value.growOnly || parseInt($iframe.style.height) < value.height)) {
        $iframe.style.height = `${value.height}px`;
    }
}

export function getWindowMetricsCall (value, srcIframe) {
    const windowMetrics = getWindowMetrics();
    answerJsonCall(value, windowMetrics, srcIframe);
}

export function updateChaynsId () {
    refreshChaynsIdIcons()
}

export function showDialogInput (value, srcIframe) {
    if (value.dialog === undefined) {
        jsonCallHelper.throwEvent(103, 2, 'Field dialog missing.', value, srcIframe);
        return;
    }
    if ((value.dialog.buttons || []).length === 0) {
        jsonCallHelper.throwEvent(103, 2, 'Field dialog.buttons missing.', value, srcIframe);
        return;
    }

    value.dialog.callback = (retVal) => answerJsonCall(value, retVal, srcIframe);

    Dialog.show('input', value.dialog);
}

export function sendEventToTopFrame (value, srcIframe) {
    let event = new CustomEvent(value.event);
    event.data = value.object;
    window.dispatchEvent(event);
}

export function setWebsiteTitle (value) {
    if (value.title) {
        document.title = value.title;
    }
}