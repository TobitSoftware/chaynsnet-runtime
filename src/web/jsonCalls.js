import Dialog from '../shared/dialog';
import WaitCursor from '../shared/wait-cursor';
import FloatingButton from '../shared/floating-button';
import { argbHexToRgba } from '../shared/utils/convert';
import { getWindowMetrics } from '../shared/utils/helper';
import { loadTapp } from './customTapp';
import { setAccessToken, closeWindow, refreshChaynsIdIcons } from '../shared/utils/native-functions';
import { login, logout } from '../shared/login';

let dateType = {
    DATE: 1,
    TIME: 2,
    DATE_TIME: 3
};

// JsonCalls

(function (jsonCalls) {

    //m[<ActionID>] = m.<ActionName> = function ...
    //==> JsonCalls.ActionName(); || JsonCalls[5]();

    jsonCalls[1] = jsonCalls.ToggleWaitCursor = function (value, srcIframe) {
        if (value.enabled) {
            WaitCursor.show(value.timeout, value.text, srcIframe[0]);
            return;
        }
        WaitCursor.hide(srcIframe[0]);
    };

    jsonCalls[2] = jsonCalls.SelectTab = function (value, srcIframe) {
        FloatingButton.hide(srcIframe[0]);

        loadTapp(value.id);
    };

    jsonCalls[9] = jsonCalls.ExternOpenUrl = function (value) {
        window.open(value.url, value.target ? value.target : '_blank');
    };

    jsonCalls[14] = jsonCalls.RequestGeoLocation = function (value, srcIframe) {
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
                    jsonCalls.Helper.return(value, obj, srcIframe);
                }, function (err) {
                    jsonCalls.Helper.throw(14, err.code + 10, err.message, value, srcIframe);
                }
            ]);

            //noinspection JSUnresolvedVariable
            if (value.permanent) {
                jsonCalls.Helper.GeoWatchNumber = requestPos(navigator.geolocation.watchPosition);
            } else {
                if (jsonCalls.Helper.GeoWatchNumber !== null) {
                    navigator.geolocation.clearWatch(jsonCalls.Helper.GeoWatchNumber);
                    jsonCalls.Helper.GeoWatchNumber = null;
                } else {
                    requestPos(navigator.geolocation.getCurrentPosition);
                }
            }
        } else {
            jsonCalls.Helper.throw(14, 10, 'Position unavailable', value, srcIframe);
        }
    };

    jsonCalls[16] = jsonCalls.ShowDialog = function (value, srcIframe) {
        if (value.dialog === undefined) {
            jsonCalls.Helper.throw(16, 2, 'Field dialog missing.', value, srcIframe);
            return;
        }
        if ((value.dialog.buttons || []).length === 0) {
            jsonCalls.Helper.throw(16, 2, 'Field dialog.buttons missing.', value, srcIframe);
            return;
        }

        value.dialog.callback = (buttonType) => jsonCalls.Helper.return(value, buttonType, srcIframe);

        Dialog.show('alert', value.dialog);
    };

    jsonCalls[18] = jsonCalls.GetGlobalData = function (value, srcIframe) {
        let data = window.ChaynsInfo.getGlobalData();
        jsonCalls.Helper.return(value, data, srcIframe);
    };

    jsonCalls[30] = jsonCalls.DateTimePicker = function (value, srcIframe) {
        if (!value.dialog) {
            value.dialog = {}
        }

        value.dialog.selectedDate = (value.selectedDate === -1) ? null : value.selectedDate;
        value.dialog.minDate = (value.minDate === -1) ? null : value.minDate;
        value.dialog.maxDate = (value.maxDate === -1) ? null : value.maxDate;
        value.dialog.callback = (ret) => jsonCalls.Helper.return(value, ret, srcIframe);

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
    };

    jsonCalls[50] = jsonCalls.MultiSelectDialog = function (value, srcIframe) {
        if (value.dialog === undefined) {
            jsonCalls.Helper.throw(50, 2, 'Field dialog missing.', value, srcIframe);
            return;
        }
        if ((value.dialog.buttons || []).length === 0) {
            jsonCalls.Helper.throw(50, 2, 'Field dialog.buttons missing.', value, srcIframe);
            return;
        }
        if ((value.list || []).length === 0) {
            jsonCalls.Helper.throw(50, 2, 'Field list missing.', value, srcIframe);
            return;
        }

        value.dialog.list = value.list;
        value.dialog.callback = (retVal) => jsonCalls.Helper.return(value, retVal, srcIframe);

        Dialog.show('select', value.dialog);
    };

    jsonCalls[52] = jsonCalls.tobitWebTokenLogin = (value) => {
        if ('tobitAccessToken' in value) {
            setAccessToken(value.tobitAccessToken);
            closeWindow();
            location.reload();
        }
    };

    jsonCalls[54] = jsonCalls.TobitLogin = function () {
        login();
    };

    jsonCalls[56] = jsonCalls.Logout = function () {
        logout();
    };

    jsonCalls[72] = jsonCalls.ShowFloatingButton = function (value, srcIfame) {
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
    };

    jsonCalls[75] = jsonCalls.AddChaynsCallErrorListener = function (value, srcIframe) {
        jsonCalls.Helper.AddJsonCallEventListener(75, value, srcIframe);
    };

    jsonCalls[77] = jsonCalls.SetIframeHeigth = function (value, srcIframe) {
        let $iframe = srcIframe[0];

        if (!value.full && !('height' in value) && !('fullViewport' in value)) {
            jsonCalls.Helper.throw(77, 2, 'Field height missing.', value, srcIframe);
            return;
        } else if (value.full || value.fullViewport) {
            value.height = getWindowMetrics().AvailHeight;
            document.body.classList.add('no-scroll');
        } else {
            value.height = parseInt(value.height, 10);
            document.body.classList.remove('no-scroll');
        }

        if (isNaN(value.height)) {
            jsonCalls.Helper.throw(77, 1, 'Field heigth is not typeof number', value, srcIframe);
            return;
        }

        value.growOnly = value.growOnly !== false; // true als default

        if ($iframe && (!value.growOnly || parseInt($iframe.style.height) < value.height)) {
            $iframe.style.height = `${value.height}px`;
        }
    };

    jsonCalls[78] = jsonCalls.GetWindowMetrics = function (value, srcIframe) {
        const windowMetrics = getWindowMetrics();
        jsonCalls.Helper.return(value, windowMetrics, srcIframe);
    };

    jsonCalls[92] = jsonCalls.UpdateChaynsId = function () {
        refreshChaynsIdIcons()
    };

    jsonCalls[103] = jsonCalls.ShowDialog = function (value, srcIframe) {
        if (value.dialog === undefined) {
            jsonCalls.Helper.throw(103, 2, 'Field dialog missing.', value, srcIframe);
            return;
        }
        if ((value.dialog.buttons || []).length === 0) {
            jsonCalls.Helper.throw(103, 2, 'Field dialog.buttons missing.', value, srcIframe);
            return;
        }

        value.dialog.callback = (retVal) => jsonCalls.Helper.return(value, retVal, srcIframe);

        Dialog.show('input', value.dialog);
    };

    jsonCalls[112] = jsonCalls.sendEventToTopFrame = function (value, srcIframe) {
        let event = new CustomEvent(value.event);
        event.data = value.object;
        window.dispatchEvent(event);
    };

    jsonCalls[114] = jsonCalls.setWebsiteTitle = function (value) {
        if (value.title) {
            document.title = value.title;
        }
    };

})(window.JsonCalls = window.JsonCalls || {});

// JsonCalls.Helper
(function (m) {
    let jsonCallEventListener = [];

    m.AddJsonCallEventListener = function (action, request, srcIframe) {
        jsonCallEventListener.push({
            action: action,
            callback: request.callback,
            addJSONParam: request.addJSONParam,
            srcIframe: srcIframe
        });
    };

    /**
     * @return {boolean}
     */
    m.DispatchJsonCallEvent = function (action, response, destIframe) {
        let retVal = false;

        jsonCallEventListener.forEach(function (listener) {
            if ((listener.action !== action) || (destIframe && listener.srcIframe !== destIframe)) {
                return;
            }
            if (!destIframe) {
                destIframe = listener.srcIframe;
            }
            window.CustomTappCommunication.AnswerJsonCall(listener, response, destIframe);
            retVal = true;
        });

        return retVal;
    };

    m.RemoveJsonCallEventListener = function (action, callback) {
        jsonCallEventListener = jsonCallEventListener.filter(function (listener) {
            if (listener.action === action) {
                return !(!callback || listener.callback === callback);
            }
            return true;
        });
    };

    m.throw = function (action, code, message, request, srcIframe) {
        const retVal = {
            action: action,
            errorCode: code,
            message: message,
            value: request
        };
        m.DispatchJsonCallEvent(75, retVal, srcIframe);
    };

    m.return = window.CustomTappCommunication.AnswerJsonCall;

    /**
     * @return {number}
     */
    m.EncodeDialogButtonTypes = function (type) {
        return type <= 0 ? type - 10 : type;
    };

    /**
     * @return {number}
     */
    m.DecodeDialogButtonTypes = function (type) {
        return type <= -10 ? type + 10 : type;
    };

    m.GeoWatchNumber = null;

    m.OverlayCloseParam = {};

    m.Throttle = function (fn, threshhold, scope) {
        threshhold = threshhold ? threshhold : 250;
        let last,
            deferTimer;
        return function () {
            const context = scope || this;

            const now = +new Date,
                args = arguments;
            if (last && now < last + threshhold) {
                // hold on to it
                clearTimeout(deferTimer);
                deferTimer = setTimeout(function () {
                    last = now;
                    fn.apply(context, args);
                }, threshhold);
            } else {
                last = now;
                fn.apply(context, args);
            }
        };
    };
})(window.JsonCalls.Helper = window.JsonCalls.Helper || {});