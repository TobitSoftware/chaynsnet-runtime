import Dialog from '../ui/dialog/dialog';
import WaitCursor from '../ui/wait-cursor';
import FloatingButton from '../ui/floating-button';
import { argbHexToRgba } from '../utils/convert';
import { getWindowMetrics, compareDate } from '../utils/helper';
import loadTapp from '../tapp/custom-tapp';
import { closeWindow, refreshChaynsIdIcons, setTobitAccessToken } from '../json-native-calls/calls/index';
import { login, logout } from '../login';
import * as jsonCallHelper from './json-call-helper';
import { answerJsonCall } from '../tapp/custom-tapp-communication';
import { chaynsInfo } from '../chayns-info';
import DATE_TYPE from '../constants/date-type';

export function toggleWaitCursor(value, srcIframe) {
    if (value.enabled) {
        WaitCursor.show(value.timeout, value.text, srcIframe[0]);
        return;
    }
    WaitCursor.hide(srcIframe[0]);
}

export function selectTab(value, srcIframe) {
    FloatingButton.hide(srcIframe[0]);

    loadTapp(value.id);
}

export function externOpenUrl(value) {
    window.open(value.url, value.target ? value.target : '_blank');
}

export function requestGeoLocation(value, srcIframe) {
    if (navigator.geolocation) {
        const requestPos = method => method.apply(navigator.geolocation, [
            (pos) => {
                const obj = {
                    accuracy: pos.coords.accuracy,
                    altitude: pos.coords.altitude,
                    altitudeAccuracy: pos.coords.altitudeAccuracy,
                    heading: pos.coords.heading,
                    latitude: pos.coords.latitude,
                    longitude: pos.coords.longitude,
                    speed: pos.coords.speed
                };
                answerJsonCall(value, obj, srcIframe);
            },
            (err) => {
                jsonCallHelper.throwEvent(14, err.code + 10, err.message, value, srcIframe);
            }
        ]);

        if (value.permanent) {
            jsonCallHelper.GeoWatchNumber = requestPos(navigator.geolocation.watchPosition);
        } else if (jsonCallHelper.GeoWatchNumber !== null) {
            navigator.geolocation.clearWatch(jsonCallHelper.GeoWatchNumber);
            jsonCallHelper.GeoWatchNumber = null;
        } else {
            requestPos(navigator.geolocation.getCurrentPosition);
        }
    } else {
        jsonCallHelper.throwEvent(14, 10, 'Position unavailable', value, srcIframe);
    }
}

export function showDialogAlert(value, srcIframe) {
    if (value.dialog === undefined) {
        return jsonCallHelper.throwEvent(16, 2, 'Field dialog missing.', value, srcIframe);
    }
    if ((value.dialog.buttons || []).length === 0) {
        return jsonCallHelper.throwEvent(16, 2, 'Field dialog.buttons missing.', value, srcIframe);
    }

    Dialog.show(Dialog.type.ALERT, value.dialog)
        .then(buttonType => answerJsonCall(value, buttonType, srcIframe));
}

export function getGlobalData(value, srcIframe) {
    const data = chaynsInfo.getGlobalData();
    answerJsonCall(value, data, srcIframe);
}

export function dateTimePicker(value, srcIframe) {
    if (!value.dialog) {
        value.dialog = {};
    }

    value.dialog.selectedDate = (value.selectedDate === -1) ? null : value.selectedDate;
    value.dialog.minDate = (value.minDate === -1) ? null : value.minDate;
    value.dialog.maxDate = (value.maxDate === -1) ? null : value.maxDate;

    let dialogType;
    switch (value.type) {
        case DATE_TYPE.DATE_TIME:
            dialogType = Dialog.type.DATETIME;
            break;
        case DATE_TYPE.DATE:
            dialogType = Dialog.type.DATE;
            break;
        case DATE_TYPE.TIME:
            dialogType = Dialog.type.TIME;
            break;
        default:
            dialogType = Dialog.type.DATETIME;
    }

    // If Device is Mobile (width smaller 451px) and DialogType is DateTime
    // -> show first Date and then Time Dialog.
    if (window.outerWidth <= 450 && dialogType === Dialog.type.DATETIME) {
        const { dialog: { minDateTS, maxDateTS, selectedDateTS } } = value;
        Dialog.show(Dialog.type.DATE, value.dialog)
            .then((dateRes) => {
                const { selectedDate: selectedDateTs } = dateRes;
                const selectedDate = new Date(selectedDateTs * 1000);

                if (compareDate(new Date(minDateTS * 1000), selectedDate)) {
                    value.dialog.minDate = minDateTS;
                } else {
                    value.dialog.minDate = null;
                }

                if (compareDate(new Date(maxDateTS * 1000), selectedDate)) {
                    value.dialog.maxDate = maxDateTS;
                } else {
                    value.dialog.maxDate = null;
                }

                value.dialog.selectedDate = selectedDateTS;

                Dialog.show(Dialog.type.TIME, value.dialog)
                    .then((timeRes) => {
                        const timeDate = new Date(timeRes.selectedDate * 1000);

                        selectedDate.setHours(timeDate.getHours());
                        selectedDate.setMinutes(timeDate.getMinutes());

                        dateRes.selectedDate = (selectedDate.getTime() / 1000).toFixed(0);
                        dateRes.buttonType = timeRes.buttonType;

                        answerJsonCall(value, dateRes, srcIframe);
                    });
            });
    } else {
        Dialog.show(dialogType, value.dialog)
            .then((ret) => {
                answerJsonCall(value, ret, srcIframe);
            });
    }
}

export function multiSelectDialog(value, srcIframe) {
    if (value.dialog === undefined) {
        return jsonCallHelper.throwEvent(50, 2, 'Field dialog missing.', value, srcIframe);
    }

    if ((value.dialog.buttons || []).length === 0) {
        return jsonCallHelper.throwEvent(50, 2, 'Field dialog.buttons missing.', value, srcIframe);
    }

    if ((value.list || []).length === 0) {
        return jsonCallHelper.throwEvent(50, 2, 'Field list missing.', value, srcIframe);
    }

    value.dialog.list = value.list;

    Dialog.show(Dialog.type.SELECT, value.dialog)
        .then(retVal => answerJsonCall(value, retVal, srcIframe));
}

export function tobitWebTokenLogin(value) {
    if ('tobitAccessToken' in value) {
        setTobitAccessToken(value.tobitAccessToken);
        closeWindow();
    }
}

export function tobitLogin() {
    login();
}

export function tobitLogout() {
    logout();
}

export function showFloatingButton(value, srcIfame) {
    if (value.enabled) {
        let bgColor = argbHexToRgba(value.color);
        bgColor = bgColor ? `rgba(${bgColor.r}, ${bgColor.g}, ${bgColor.b}, ${bgColor.a})` : '';
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

        const callback = () => answerJsonCall(value, null, srcIfame);

        FloatingButton.show(text, srcIfame[0], bgColor, color, callback);
    } else {
        FloatingButton.hide(srcIfame[0]);
    }
}

export function addChaynsCallErrorListener(value, srcIframe) {
    jsonCallHelper.addJsonCallEventListener(75, value, srcIframe);
}

export function setIframeHeigth(value, srcIframe) {
    const $iframe = srcIframe[0];

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

export function getWindowMetricsCall(value, srcIframe) {
    const windowMetrics = getWindowMetrics();
    answerJsonCall(value, windowMetrics, srcIframe);
}

export function updateChaynsId() {
    refreshChaynsIdIcons();
}

export function showDialogInput(value, srcIframe) {
    if (value.dialog === undefined) {
        return jsonCallHelper.throwEvent(103, 2, 'Field dialog missing.', value, srcIframe);
    }

    if ((value.dialog.buttons || []).length === 0) {
        return jsonCallHelper.throwEvent(103, 2, 'Field dialog.buttons missing.', value, srcIframe);
    }

    Dialog.show(Dialog.type.INPUT, value.dialog)
        .then(retVal => answerJsonCall(value, retVal, srcIframe));
}

export function sendEventToTopFrame(value, srcIframe) {
    const event = new CustomEvent(value.event);
    event.data = value.object;
    window.dispatchEvent(event);
}

export function setWebsiteTitle(value) {
    if (value.title) {
        document.title = value.title;
    }
}
