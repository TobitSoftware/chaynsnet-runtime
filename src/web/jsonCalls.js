import DialogNew from '../shared/dialog';
import WaitCursor from '../shared/wait-cursor';
import FloatingButton from '../shared/floating-button';
import {argbHexToRgba} from '../shared/utils/convert';
import {getWindowMetrics} from '../shared/utils/helper';

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

        //noinspection Eslint
        if (value.params && Array === value.params.constructor) {
            value.params = '?' + value.params.join('&');
        }

        window.ChaynsWeb.SelectTapp(value);
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

        DialogNew.show('alert', value.dialog);
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

        DialogNew.show(dialogType, value.dialog);
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

        DialogNew.show('select', value.dialog);
    };

    jsonCalls[54] = jsonCalls.TobitLogin = function (value) {
        if ((value.urlParams || []).length) {
            window.Login.setReloadParams(value.urlParams);
        }

        if ((value.fbPermissions || []).length) {
            window.Login.facebookLogin(false, value.fbPermissions.join(','));
        } else {
            if (!window.ChaynsInfo.IsFacebook) {
                window.Login.showDialog();
            } else {
                window.Login.facebookLogin();
            }
        }
    };

    jsonCalls[56] = jsonCalls.Logout = function (value) {
        window.logout();
    };

    jsonCalls[72] = jsonCalls.ShowFloatingButton = function (value, srcIfame) {
        jsonCalls.Helper.RemoveJsonCallEventListener(72);
        if (value.enabled) {
            var bgColor = argbHexToRgba(value.color);
            bgColor = bgColor ? `rgba(${bgColor.r}, ${bgColor.g}, ${bgColor.b}, ${bgColor.a})` : '';
            //noinspection JSUnresolvedVariable
            var color = argbHexToRgba(value.colorText);
            color = color ? `rgba(${color.r}, ${color.g}, ${color.b}, ${color.a})` : '';
            var text;
            if ('text' in value) {
                text = value.text;
            } else if ('icon' in value) {
                text = `<span class='fa ${value.icon}'></span>`;
            } else {
                text = '!';
            }
            FloatingButton.show(text, srcIfame[0], bgColor, color);
            jsonCalls.Helper.AddJsonCallEventListener(72, value, srcIfame);
        } else {
            FloatingButton.hide(srcIfame[0]);
        }
    };

    jsonCalls[75] = jsonCalls.AddChaynsCallErrorListener = function (value, srcIframe) {
        jsonCalls.Helper.AddJsonCallEventListener(75, value, srcIframe);
    };

    jsonCalls[77] = jsonCalls.SetIframeHeigth = function (value, srcIframe) {
        //noinspection JSUnresolvedVariable
        if (window.ChaynsInfo.IsFacebook && window.FB) {
            setTimeout(function () {
                //noinspection JSUnresolvedVariable,JSUnresolvedFunction
                window.FB.Canvas.setSize({
                    'height': $(document.body).height()
                });
            }, 500);
        }

        let $iframe = srcIframe;

        if (!value.full && !('height' in value) && !('fullViewport' in value)) {
            jsonCalls.Helper.throw(77, 2, 'Field height missing.', value, srcIframe);
            return;
        } else if (value.full) {
            value.height = getWindowMetrics().AvailHeight;
        } else if (value.fullViewport) {
            let $NavItems = $('#NavItems');
            let $PageHead = $('#PageHead');
            let navHeight = $NavItems.height();
            let maxHeight = $NavItems.height() + 45;
            let headerHeight = $PageHead.height() + ($('.domainOfferAttention').outerHeight() || 0);
            let pageheadHeight = $PageHead.height() + $('#TitleConnect').height() + 50;
            let minHeight = $(window).height() - headerHeight - 35;
            let h, margin;

            $('#BodyContent').css('margin-bottom', '0px');
            $('#BodyContentCell').css('padding-bottom', '0px');
            value.height = $(window.top).height() + $(window).scrollTop() - $PageHead.height() - $('#TitleConnectSites').height() - 30;
            if (value.height > $(window.top).height()) {
                value.height = $(window.top).height();
            }
            $iframe.height(value.height);
            $(window).bind('scroll', function () {
                if (minHeight > maxHeight) {
                    maxHeight = minHeight;
                }

                h = minHeight + $(window).scrollTop();

                if (h > maxHeight) {
                    h = maxHeight;
                } else {
                    h = h - 25;
                }

                if (h < $(window).height() - 28) {
                    $iframe.height(h);
                    $iframe.css('margin-top', -35);
                } else {
                    margin = $(window).scrollTop() - pageheadHeight;
                    if (margin + $iframe.height() <= navHeight + 65) {
                        $iframe.css('margin-top', margin);
                        $iframe.height($(window).height());
                    }
                }
            });
        } else {
            value.height = parseInt(value.height, 10);
        }

        if (isNaN(value.height)) {
            jsonCalls.Helper.throw(77, 1, 'Field heigth is not typeof number', value, srcIframe);
            return;
        }

        value.growOnly = value.growOnly !== false; // true als default

        if ($iframe && (!value.growOnly || $iframe[0].style.height < value.height)) {
            $iframe[0].style.height = value.height;
        }

        // if (window.positionFloatingButton) {
        //     window.positionFloatingButton();
        // }
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

        DialogNew.show('input', value.dialog);
    };

})(window.JsonCalls = window.JsonCalls || {});

// JsonCalls.Helper
(function (m) {
    var jsonCallEventListener = [];

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
        var retVal = false;

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
        var retVal = {
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
        var last,
            deferTimer;
        return function () {
            var context = scope || this;

            var now = +new Date,
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