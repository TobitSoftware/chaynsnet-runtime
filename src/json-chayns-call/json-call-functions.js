import Dialog from '../ui/dialog/dialog';
import WaitCursor from '../ui/wait-cursor';
import FloatingButton from '../ui/floating-button';
import { argbHexToRgba } from '../utils/convert';
import { getWindowMetrics, compareDate } from '../utils/helper';
import loadTapp from '../tapp/custom-tapp';
import { refreshChaynsIdIcons } from '../json-native-calls/calls/index';
import { showLogin, logout, login } from '../login';
import * as jsonCallHelper from './json-call-helper';
import { chaynsInfo } from '../chayns-info';
import DATE_TYPE from '../constants/date-type';
import { removeKeyForTapp, setKeyForTapp, getKeyForTapp } from '../utils/chayns-storage';
import {
    getSavedIntercomChats as getSavedIntercomChatsCall,
    setIntercomChatData as setIntercomChatDataCall
} from '../json-native-calls/calls/index';

export function toggleWaitCursor(req, res) {
    if (req.value.enabled) {
        WaitCursor.show(req.value.timeout, req.value.text, req.srcIframe[0]);
        return;
    }
    WaitCursor.hide(req.srcIframe[0]);
}

export function selectTab(req, res) {
    FloatingButton.hide(req.srcIframe[0]);

    loadTapp(req.value.id);
}

export function requestGeoLocation(req, res) {
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
                res.answer(obj);
            },
            (err) => {
                res.event(err.code + 10, err.message);
            }
        ]);

        if (req.value.permanent) {
            jsonCallHelper.GeoWatchNumber = requestPos(navigator.geolocation.watchPosition);
        } else if (jsonCallHelper.GeoWatchNumber !== null) {
            navigator.geolocation.clearWatch(jsonCallHelper.GeoWatchNumber);
            jsonCallHelper.GeoWatchNumber = null;
        } else {
            requestPos(navigator.geolocation.getCurrentPosition);
        }
    } else {
        res.event(10, 'Position unavailable');
    }
}

export function showDialogAlert(req, res) {
    if (!req.value || req.value.dialog === undefined) {
        return res.event(2, 'Field dialog missing.');
    }
    if ((req.value.dialog.buttons || []).length === 0) {
        return res.event(2, 'Field dialog.buttons missing.');
    }

    Dialog.show(Dialog.type.ALERT, req.value.dialog)
        .then(buttonType => res.answer(buttonType));
}

export function getGlobalData(req, res) {
    const data = chaynsInfo.getGlobalData();
    res.answer(data);
}

export function dateTimePicker(req, res) {
    const value = req.value;

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

                        res.answer(dateRes);
                    });
            });
    } else {
        Dialog.show(dialogType, value.dialog)
            .then((ret) => {
                res.answer(ret);
            });
    }
}

export function multiSelectDialog(req, res) {
    if (!req.value || req.value.dialog === undefined) {
        return res.event(2, 'Field dialog missing.');
    }

    if ((req.value.dialog.buttons || []).length === 0) {
        return res.event(2, 'Field dialog.buttons missing.');
    }

    if ((req.value.list || []).length === 0) {
        return res.event.throwEvent(2, 'Field list missing.');
    }

    req.value.dialog.list = req.value.list;

    Dialog.show(Dialog.type.SELECT, req.value.dialog)
        .then(retVal => res.answer(retVal));
}

export function tobitWebTokenLogin(req, res) {
    if (req.value && 'tobitAccessToken' in req.value) {
        login(req.value.tobitAccessToken);
    }
}

export function tobitLogin(req, res) {
    showLogin();
}

export function tobitLogout(req, res) {
    logout();
}

export function showFloatingButton(req, res) {
    const value = req.value;

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

        const callback = () => res.answer();

        FloatingButton.show(text, req.srcIframe[0], bgColor, color, callback);
    } else {
        FloatingButton.hide(req.srcIframe[0]);
    }
}

export function setObjectForKey(req, res) {
    const value = req.value;
    const tappId = chaynsInfo.getGlobalData().AppInfo.TappSelected.Id;

    if (value.object == null) {
        removeKeyForTapp(tappId, value.key, value.accessMode);
    } else {
        setKeyForTapp(tappId, value.key, value.object, value.accessMode, value.tappIDs);
    }
}

export async function getObjectForKey(req, res) {
    const tappId = chaynsInfo.getGlobalData().AppInfo.TappSelected.Id;

    const item = await getKeyForTapp(tappId, req.value.key, req.value.accessMode);
    res.answer({ object: item });
}

export function addChaynsCallErrorListener(req, res) {
    req.addJsonCallEventListener(75);
}

export function setIframeHeigth(req, res) {
    const $iframe = req.srcIframe[0];
    const value = req.value;

    if (!value.full && !('height' in value) && !('fullViewport' in value)) {
        res.event(2, 'Field height missing.');
        return;
    } else if (value.full || value.fullViewport) {
        value.height = getWindowMetrics().AvailHeight;
        document.body.classList.add('no-scroll');
    } else {
        value.height = parseInt(value.height, 10);
        document.body.classList.remove('no-scroll');
    }

    if (isNaN(value.height)) {
        req.event(1, 'Field heigth is not typeof number');
        return;
    }

    value.growOnly = value.growOnly !== false; // true als default

    if ($iframe && (!value.growOnly || parseInt($iframe.style.height) < value.height)) {
        $iframe.style.height = `${value.height}px`;
    }
}

export function getWindowMetricsCall(req, res) {
    const windowMetrics = getWindowMetrics();
    res.answer(windowMetrics);
}

export function updateChaynsId(req, res) {
    refreshChaynsIdIcons();
}

export function showDialogInput(req, res) {
    if (!req.value || req.value.dialog === undefined) {
        return res.event(2, 'Field dialog missing.');
    }

    if ((req.value.dialog.buttons || []).length === 0) {
        return res.event(2, 'Field dialog.buttons missing.');
    }

    Dialog.show(Dialog.type.INPUT, req.value.dialog)
        .then(retVal => res.answer(retVal));
}

export function sendEventToTopFrame(req, res) {
    if (!req.value || !req.value.event) {
        return res.event(2, 'Field event missing.');
    }

    const event = new CustomEvent(req.value.event);
    event.data = req.value.object;
    window.dispatchEvent(event);
}

export function setWebsiteTitle(req, res) {
    if (!req.value || !req.value.title) {
        return res.event(2, 'Field title missing.');
    }

    document.title = req.value.title;
}

export function getSavedIntercomChats(req, res) {
    if (!req.value || !req.value.itemId) {
        return res.event(2, 'Field itemId missing.');
    }

    getSavedIntercomChatsCall(req.value.itemId).then((retVal) => {
        res.answer({
            status: retVal.status.code,
            data: retVal.data
        });
    });
}

export function setIntercomChatData(req, res) {
    if (!req.value || req.value.data === undefined) {
        return res.event(2, 'Field data missing.');
    }

    setIntercomChatDataCall(req.value.data).then((retVal) => {
        res.answer({
            status: retVal.status.code,
            data: retVal.data
        });
    });
}
