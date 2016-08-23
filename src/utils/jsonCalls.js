//import Dialog from '../shared/dialog';

// JsonCalls

(function (jsonCalls) {

    //m[<ActionID>] = m.<ActionName> = function ...
    //==> JsonCalls.ActionName(); || JsonCalls[5]();

    jsonCalls[1] = jsonCalls.ToggleWaitCursor = function (value) {
        window.ChaynsWeb.toggleLoadingCursor(value.enabled, value.timeout, value.text);
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

        var buttons = [];
        if (value.dialog.buttons && value.dialog.buttons.length) {
            value.dialog.buttons.forEach(function (btn) {
                buttons.push({
                    Text: btn.text,
                    Icon: btn.icon,
                    Value: jsonCalls.Helper.EncodeDialogButtonTypes(btn.buttonType)
                });
            });
        }

        new Dialog({
            Headline: value.dialog.title,
            Text: value.dialog.message,
            Buttons: buttons,
            Callback: function (val) {
                jsonCalls.Helper.return(value, {
                    buttonType: jsonCalls.Helper.DecodeDialogButtonTypes(val)
                }, srcIframe);
            }
        }, 'hint');
    };

    jsonCalls[18] = jsonCalls.GetGlobalData = function (value, srcIframe) {
        var data = window.ChaynsInfo.getGlobalData();
        jsonCalls.Helper.return(value, data, srcIframe);
    };

    jsonCalls[30] = jsonCalls.DateTimePicker = function (value, srcIframe) {
        // ReSharper disable once UnusedLocals
        new Dialog({
            Headline: value.dialog && value.dialog.title ? value.dialog.title : '',
            Text: value.dialog && value.dialog.message ? value.dialog.message : '',
            Type: 'datepicker',
            TimeMode: value.type === 4 ? 3 : value.type,
            Timestamp: value.selectedDate,
            MinTimestamp: value.minDate,
            MaxTimestamp: value.maxDate,
            Callback: function (date) {
                jsonCalls.Helper.return(value, {
                    selectedDate: date
                }, srcIframe);
            }
        }, 'datepicker');
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

        var buttons = [];
        if (value.dialog.buttons && value.dialog.buttons.length) {
            value.dialog.buttons.forEach(function (btn) {
                buttons.push({
                    Text: btn.text,
                    Icon: btn.icon,
                    Value: jsonCalls.Helper.EncodeDialogButtonTypes(btn.buttonType)
                });
            });
        }

        var items = [];
        if (value.list && value.list.length) {
            value.list.forEach(function (item) {
                items.push({
                    Text: item.name,
                    Value: item.value,
                    Icon: item.icon,
                    Preselect: item.isSelected || false,
                    Image: item.image || undefined
                });
            });
        }

        // ReSharper disable once UnusedLocals
        new Dialog({
            Text: value.dialog.message,
            Headline: value.dialog.title,
            Buttons: buttons,
            Items: items,
            Selection: value.dialog.multiselect ? 1 : 0, //1: Multi, 0: singleSelect, 2: buttonInfo
            Quickfind: value.dialog.quickfind ? 1 : 0,
            Callback: function (val) {
                var selection = [], buttonType;
                if (val instanceof Array) {
                    buttonType = 1;
                    val.forEach(function (item) {
                        selection.push({
                            name: item.Text,
                            value: item.Value
                        });
                    });
                } else if (typeof val === 'object' && val !== null) {
                    buttonType = 1;
                    selection = [
                        {
                            name: val.Text,
                            value: val.Value
                        }
                    ];
                } else {
                    buttonType = jsonCalls.Helper.DecodeDialogButtonTypes(val);
                }
                jsonCalls.Helper.return(value, {
                    buttonType: buttonType,
                    selection: selection
                }, srcIframe);
            }
        }, 'selection');
    };

    jsonCalls[72] = jsonCalls.ShowFloatingButton = function (value, srcIfame) {
        jsonCalls.Helper.RemoveJsonCallEventListener(72);
        if (value.enabled) {
            var bgColor = window.ChaynsWeb.ConvertArgbHexToRgba(value.color);
            bgColor = bgColor ? 'rgba(' + bgColor.r + ', ' + bgColor.g + ', ' + bgColor.b + ', ' + bgColor.a + ')' : '';
            var color = window.ChaynsWeb.ConvertArgbHexToRgba(value.colorText);
            color = color ? 'rgba(' + color.r + ', ' + color.g + ', ' + color.b + ', ' + color.a + ')' : '';
            var text;
            if ('text' in value) {
                text = value.text;
            } else if ('icon' in value) {
                text = `<span class='fa ${value.icon}'></span>`;
            } else {
                text = '!';
            }
            window.ChaynsWeb.setFloatingButton(text, bgColor, color);
            jsonCalls.Helper.AddJsonCallEventListener(72, value, srcIfame);
        } else {
            window.ChaynsWeb.removeFloatingButton();
        }
    };

    jsonCalls[73] = jsonCalls.SetObjectForKey = function (value, srcIframe) {
        var activeTapp = window.Navigation.GetActiveTapp();

        var tappId = srcIframe[0].id === 'ChaynsIDFrame' ? -7 : (activeTapp.IsSubTapp ? activeTapp.ParentTappId : activeTapp.Id);

        if (value.object == null) {
            window.ChaynsStorage.removeKey(value.key);
        } else {
            //noinspection JSUnresolvedVariable
            window.ChaynsStorage.setKeyForTapp(tappId, value.key, value.object, value.accessMode, value.tappIDs);
        }
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
        if (!value.fullViewport && $(srcIframe).attr('id') !== 'AdminAdvertisingFrame') {
            $(window).unbind('scroll');
        }

        let $iframe = $(srcIframe || window.ChaynsWeb.CustomTappIframe);

        if (!value.full && !('height' in value) && !('fullViewport' in value)) {
            jsonCalls.Helper.throw(77, 2, 'Field height missing.', value, srcIframe);
            return;
        } else if (value.full) {
            value.height = window.ChaynsWeb.getWindowMetrics().AvailHeight;
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

        if ($iframe) {
            if ($iframe.attr('name') === 'ChaynsIDFrame') {
                const titleConnectHeight = 45;
                const $ChaynsIDWrapper = $('#ChaynsIDWrapper');
                const $scroller = $('#scroller');

                if (window.ChaynsInfo.IsMobile) {
                    $ChaynsIDWrapper.css('max-height', window.innerHeight - titleConnectHeight);
                    $iframe.css('max-height', window.innerHeight - titleConnectHeight);
                    $ChaynsIDWrapper.css('height', window.innerHeight - titleConnectHeight);
                    $iframe.css('height', window.innerHeight - titleConnectHeight);
                } else {
                    var scrollBar = document.querySelector('.iScrollIndicator');
                    var H = $scroller.outerHeight(true),
                        sH = $scroller.scrollHeight,
                        sbH = H * H / sH;
                    if (scrollBar) {
                        scrollBar.style.height = sbH + 'px';
                    }
                    $ChaynsIDWrapper.css('max-height', parseInt(window.innerHeight, 10) - 45 < value.height ? window.innerHeight - 45 : value.height);
                    $iframe.css('max-height', value.height);
                    setTimeout(function () {
                        if (window.innerHeight - 45 >= $('#scroller').height()) {
                            //noinspection JSUnresolvedVariable,ES6ModulesDependencies,Eslint
                            scroller.style.overflow = 'hidden';
                        } else {
                            //noinspection JSUnresolvedVariable,ES6ModulesDependencies,Eslint
                            scroller.style.overflow = 'auto';
                        }
                    }, 300);
                }

            } else if (!value.growOnly || $iframe.height() < value.height) {
                $iframe.height(value.height);
            }
        }

        if (window.positionFloatingButton) {
            window.positionFloatingButton();
        }
    };

    jsonCalls[78] = jsonCalls.GetWindowMetrics = function (value, srcIframe) {
        const windowMetrics = window.ChaynsWeb.getWindowMetrics();
        jsonCalls.Helper.return(value, windowMetrics, srcIframe);
    };

    jsonCalls[81] = jsonCalls.ScrollToPosition = function (value) {
        const pos = parseInt(value.position, 10);

        if (!isNaN(pos)) {
            if (pos < 0) {
                $('html, body').animate({scrollTop: 0});
                window.ChaynsWeb.scrollPos = $(window).scrollTop();
            } else {
                window.ChaynsWeb.scrollToIframePos(pos);
            }
        }
    };

    jsonCalls[84] = jsonCalls.UpdateNavigation = function (value) {
        //noinspection JSUnresolvedVariable
        value.stateOnly = value.stateOnly || value.StateOnly;
        //noinspection JSUnresolvedVariable
        value.tappId = value.tappId || value.tappID || value.TappID;

        if (value.updateTapp === undefined) {
            value.updateTapp = true;
        }

        if (value.stateOnly) {
            window.Navigation.UpdateInterComTapp();
        } else {
            //noinspection Eslint
            if (is.array(value.params)) {
                value.params = '?' + value.params.join('&');
            }
            window.ChaynsWeb.RefreshNavigation(value.tappId, undefined, undefined, !value.updateTapp, value.params);
        }
    };

    jsonCalls[88] = jsonCalls.SetAdminSwitchCallback = function (value, srcIframe) {
        jsonCalls.Helper.RemoveJsonCallEventListener(88);
        jsonCalls.Helper.AddJsonCallEventListener(88, value, srcIframe);
    };

    jsonCalls[97] = jsonCalls.GetScrollPosition = function (value, srcIframe) {
        $(window).unbind('scroll');
        var retVal = window.ChaynsWeb.getWindowMetrics();
        $(window).bind('scroll', function () {
            retVal = window.ChaynsWeb.getWindowMetrics();
            jsonCalls.Helper.return(value, retVal, srcIframe);
        });
        jsonCalls.Helper.return(value, retVal, srcIframe);
    };

    jsonCalls[92] = jsonCalls.UpdateChaynsId = function () {
        chaynsId.loadChaynsIdIcons(true);
    };

    jsonCalls[101] = jsonCalls.UpdateChaynsWeb = function (value) {
        if (value.component === 'titleImageVisability') {
            if (!window.ChaynsInfo.IsMobile) {
                window.CustomTappCommunication.Functions.showhidetitleimage(value.param ? '0' : '1');
            } else {
                window.ChaynsWeb.hideCover();
            }
        } else if (value.component === 'colorScheme') {
            let path = document.querySelector('#colorSchemeCss').getAttribute('href');
            //noinspection JSCheckFunctionSignatures
            path = path.replace(window.ChaynsInfo.ColorScheme.Name, value.param.name).replace(window.ChaynsInfo.ColorScheme.BaseColor.replace('#', ''), value.param.hexColor).replace('id=' + window.ChaynsInfo.ColorScheme.ID, 'id=' + value.param.id);
            let bgurl = document.body.style.backgroundImage;

            if (bgurl !== undefined) {
                document.body.style.backgroundImage = bgurl.replace(window.ChaynsInfo.ColorScheme.Name, value.param.name);
            }

            var styles = document.getElementsByTagName('link');

            for (var i = 0; i < styles.length; i++) {
                if (styles[i].getAttribute('href').indexOf('/css/chayns') > 0) {
                    styles[i].setAttribute('href', styles[i].getAttribute('href').replace(window.ChaynsInfo.ColorScheme.BaseColor.replace('#', ''), value.param.hexColor.replace('#', '')));
                }
            }

            window.ChaynsInfo.ColorScheme.Name = value.param.name;
            window.ChaynsInfo.ColorScheme.BaseColor = '#' + value.param.hexColor;
            window.ChaynsInfo.ColorScheme.ID = value.param.id;
            document.querySelector('#colorSchemeCss').setAttribute('href', path);
        } else if (value.component === 'titleImageUrl') {
            if (!window.ChaynsInfo.IsMobile) {
                let $coverImage = document.querySelector('#CoverImage');

                if ($coverImage.getAttribute('src') !== value.param) {
                    $coverImage.setAttribute('src', value.param);
                }
            }
        } else if (value.component === 'backgroundImageUrl') {
            document.body.style.backgroundImage = `url(${value.param})`;
        } else if (value.component === 'backgroundImage') {
            if (value.param === 'cover') {
                document.body.style.backgroundRepeat = '';
                document.body.style.backgroundSize = 'cover';
            } else if (value.param === 'repeat') {
                document.body.style.backgroundRepeat = 'repeat';
                document.body.style.backgroundSize = '';
            }
        } else if (value.component === 'navigation' && !window.ChaynsInfo.IsMobile) {
            let pageBody = $('#PageBody');
            let navigation = $('#Navigation');
            let $scroller = $('#scroller');

            if (value.param === 'right') {
                pageBody.append(navigation);
                $scroller.find('.left').removeClass('left').addClass('right');
            } else if (value.param === 'left') {
                pageBody.prepend(navigation);
                $scroller.find('.right').removeClass('right').addClass('left');
            }
        } else if (value.component === 'locationIcon') {
            let icon = document.getElementById('locationIcon');
            icon.style.display = '';
            $(icon).attr('src', value.param);
        } else if (value.component === 'locationLogo') {
            if (document.getElementById('PageNameMain')) {
                $('#PageNameMain').html('<div class=\'LocationLogo\' style=\'background-image: url(' + value.param + ')\'></div>');
            }
        } else if (value.component === 'imageOverlay') {
            let pageHead = document.getElementById('PageHead');

            if (document.getElementById('CoverImageOverlay')) {
                $('#CoverImageOverlay').attr('src', value.param);
            } else {
                $(pageHead).append(`<img id='CoverImageOverlay' src='${value.param}'>`);
            }
        }
    };

    jsonCalls[102] = jsonCalls.AddScrollListener = function (value, srcIframe) {
        function scrollListener(event) {
            jsonCalls.Helper.return(value, {
                'event': {
                    bubbles: event.bubbles,
                    cancelBubble: event.cancelBubble,
                    cancelable: event.cancelable,
                    defaultPrevented: event.defaultPrevented,
                    eventPhase: event.eventPhase,
                    isTrusted: event.isTrusted,
                    returnValue: event.returnValue,
                    timeStamp: event.timeStamp,
                    type: event.type,
                    scrollX: window.scrollX,
                    scrollY: window.scrollY
                },
                'windowMetrics': window.ChaynsWeb.getWindowMetrics()
            }, srcIframe);
        }

        window.addEventListener('scroll', jsonCalls.Helper.Throttle(scrollListener, parseInt(value.throttle, 10) || 200));
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

        var buttons = [];
        if (value.dialog.buttons && value.dialog.buttons.length) {
            value.dialog.buttons.forEach(function (btn) {
                buttons.push({
                    Text: btn.text,
                    Icon: btn.icon,
                    Value: jsonCalls.Helper.EncodeDialogButtonTypes(btn.buttonType)
                });
            });
        }

        // ReSharper disable once UnusedLocals
        //noinspection JSUnresolvedVariable
        new Dialog({
            Headline: value.dialog.title,
            Text: value.dialog.message,
            Placeholder: value.dialog.placeholderText,
            Buttons: buttons,
            Callback: function (val) {
                jsonCalls.Helper.return(value, {
                    buttonType: jsonCalls.Helper.DecodeDialogButtonTypes(val.buttonType),
                    text: val.text
                }, srcIframe);
            }
        }, 'input');
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