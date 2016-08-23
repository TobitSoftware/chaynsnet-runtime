import Dialog from '../shared/dialog';
import Overlay from '../shared/overlay';

(function (module) {
    function onWindowMessage(e) {
        e = e.originalEvent;

        let chaynsNamespace = /^((chayns.\w*.)(\w*))@?(\w*)?:(\{?.*}?)/;

        // 0-1: string, 2: namespace, 3: method, 4: sourceIFrame, 5: Params
        let result = chaynsNamespace.exec(e ? e.data : '');
        if (result) {
            if (result[3]) {
                let fn = module.Functions[result[3].toLowerCase()];
                if (typeof fn == 'function') {
                    fn(result[5], [
                        result[4] ? $('[name="' + result[4] + '"]')[0] : null,
                        result[2]
                    ]);
                }
            }
        }
    }

    module.Init = () => $(window).on('message', onWindowMessage);

    module.PostMessage = (method, params, source) => {
        let win = null;
        let $customTappIframe = window.ChaynsWeb.CustomTappIframe ? window.ChaynsWeb.CustomTappIframe : document.querySelector('#CustomTappIframe');
        let iframe = source[0] ? source[0] : $customTappIframe;

        if (iframe !== null) {
            win = iframe.contentWindow ? iframe.contentWindow : iframe;
        }

        if (win && typeof win.postMessage === 'function') {
            params = params || '';
            try {
                //noinspection JSCheckFunctionSignatures
                win.postMessage((source[1] || 'chayns.customTab.' ) + method + ':' + params.toString(), '*');
            } catch (e) {
                logger.log({
                    msg: (source[1] || 'chayns.customTab.' ) + method + ':' + params.toString(),
                    exception: e.message,
                    stacktrace: e.stack,
                    section: 'PostMessage',
                    type: logger.type.error,
                    applicationname: 'CustomTappCommunicationsJs',
                    tappId: window.Navigation.GetActiveTappID(),
                    userAgent: navigator ? navigator.userAgent : 'no user agent',
                    isMobile: !!window.ChaynsInfo.IsMobile,
                    siteid: window.ChaynsInfo && window.ChaynsInfo.SiteID ? window.ChaynsInfo.SiteID : ''
                });
            }
        }
    };

    module.AnswerJsonCall = (request, response, srcIframe) => {
        let params = JSON.stringify({
            addJSONParam: request.addJSONParam || {},
            retVal: response || {},
            callback: request.callback
        });
        module.PostMessage('jsoncall', params, srcIframe);
    };
})(window.CustomTappCommunication = {});

//CustomTappCommunication.Functions
(function (module, parent) {
    module.forceheight = (params, srcIframe) => {
        let $customTappIframe = document.querySelector('#CustomTappIframe');

        $(window).off('scroll.fullHeight');
        $(window).off('resize.fullHeight');
        $('#BodyContentCell').css('paddingBottom', '');
        let $iframe = srcIframe[0] ? srcIframe[0] : $customTappIframe;

        if ($customTappIframe && $customTappIframe.style && $customTappIframe.style.marginTop && !window.ChaynsInfo.IsMobile) {
            $customTappIframe.style.marginTop = -35;
        }

        if ($iframe) {
            $iframe.style.height = `${params}px`;
        }
    };

    module.height = (params, srcIframe) => {
        let $customTappIframe = document.querySelector('#CustomTappIframe');

        $(window).off('scroll.fullHeight');
        $(window).off('resize.fullHeight');
        $('#BodyContentCell').css('paddingBottom', '');

        let $iframe = srcIframe[0] ? srcIframe[0] : $customTappIframe,
            newHeight = parseInt(params, 10);

        if ($customTappIframe && $customTappIframe.style && $customTappIframe.style.marginTop && !window.ChaynsInfo.IsMobile) {
            $customTappIframe.style.marginTop = -35;
        }

        if ($iframe && !isNaN(newHeight)) {
            $iframe.style.height = `${parseInt(params, 10) + (window.ChaynsInfo.IsMobile ? 35 : 0 )}px`;
        }

        if (!window.ChaynsInfo.IsMobile) {
            let navHeight = $('#BodyContent').height() + 45;
            $('#Navigation').css('min-height', navHeight);
        }
    };

    module.scrolltoy = params => {
        let offset = parseFloat(params);
        let duration = 0;
        if (isNaN(offset)) {
            try {
                let obj = JSON.parse(params);
                offset = obj.offset;
                duration = obj.duration;
            } catch (e) {
                logger.log({
                    exception: e.message,
                    stacktrace: e.stack,
                    section: 'scrolltoy',
                    type: logger.type.error,
                    applicationname: 'CustomTappCommunicationsJs',
                    tappId: window.Navigation.GetActiveTappID(),
                    userAgent: navigator ? navigator.userAgent : 'no user agent',
                    isMobile: !!window.ChaynsInfo.IsMobile,
                    siteid: window.ChaynsInfo && window.ChaynsInfo.SiteID ? window.ChaynsInfo.SiteID : ''
                });
            }
        }
        if (!isNaN(offset) && !isNaN(duration)) {
            $('html, body').animate({
                scrollTop: offset
            }, duration);
            window.ChaynsWeb.scrollPos = $(window).scrollTop();
        }
    };

    module.facebookconnect = params => {
        try {
            $('.overlayCloser').click();
            let oParams = JSON.parse(params);
            //noinspection JSUnresolvedVariable
            window.Facebook.ShowLoginDlg(oParams.Permissions, oParams.ReloadParameter);
        } catch (e) {
            logger.log({
                exception: e.message,
                stacktrace: e.stack,
                section: 'facebookconnect',
                type: logger.type.error,
                applicationname: 'CustomTappCommunicationsJs',
                tappId: window.Navigation.GetActiveTappID(),
                userAgent: navigator ? navigator.userAgent : 'no user agent',
                isMobile: !!window.ChaynsInfo.IsMobile,
                siteid: window.ChaynsInfo && window.ChaynsInfo.SiteID ? window.ChaynsInfo.SiteID : ''
            });
        }
    };

    module.tobitconnect = params => {
        if (typeof (params) === 'string') {
            try {
                params = JSON.parse(params);
            } catch (e) {
                logger.log({
                    exception: e.message,
                    stacktrace: e.stack,
                    section: 'tobitconnect',
                    type: logger.type.error,
                    applicationname: 'CustomTappCommunicationsJs',
                    tappId: window.Navigation.GetActiveTappID(),
                    userAgent: navigator ? navigator.userAgent : 'no user agent',
                    isMobile: !!window.ChaynsInfo.IsMobile,
                    siteid: window.ChaynsInfo && window.ChaynsInfo.SiteID ? window.ChaynsInfo.SiteID : ''
                });
            }
            if (typeof (params) === 'string' && (params.indexOf('ExecCommand') > -1)) {
                let temp = params;
                params = {
                    ExecCommand: null
                };
                params.ExecCommand = temp.replace('ExecCommand=', '');
            }
        }

        window.Login.showDialog(params);
    };

    module.showloadingcursor = () => window.ChaynsWeb.toggleLoadingCursor(true);

    module.hideloadingcursor = () => window.ChaynsWeb.toggleLoadingCursor(false);

    module.getappinfos = (params, srcIframe) => {
        let appinfos = window.ChaynsInfo.getGlobalData();
        parent.PostMessage('getAppInfos', JSON.stringify(appinfos), srcIframe);
    };

    module.selectothertab = params => {
        try {
            let paramsObj;

            try {
                paramsObj = JSON.parse(params);
            } catch (es) {
                paramsObj = params;
            }

            try {
                paramsObj.Parameter = JSON.parse(paramsObj.Parameter);
            } catch (e) {
                logger.log({
                    exception: e.message,
                    stacktrace: e.stack,
                    msg: `failed to parse parameters: ${paramsObj.Parameter}`,
                    section: 'selectothertab',
                    type: logger.type.error,
                    applicationname: 'CustomTappCommunicationsJs',
                    tappId: window.Navigation.GetActiveTappID(),
                    userAgent: navigator ? navigator.userAgent : 'no user agent',
                    isMobile: !!window.ChaynsInfo.IsMobile,
                    siteid: window.ChaynsInfo && window.ChaynsInfo.SiteID ? window.ChaynsInfo.SiteID : ''
                });
            }

            let tappName = paramsObj.Tab;
            let isNumber = /^[0-9]+$/;
            let tappIndex;
            //noinspection JSCheckFunctionSignatures
            if (isNumber.test(tappName)) {
                tappIndex = parseInt(tappName, 10);
            }

            let reload = false;
            if (paramsObj.Parameter !== undefined) {
                // ReSharper disable once PossiblyUnassignedProperty
                //noinspection JSUnresolvedVariable
                reload = paramsObj.Parameter.Reload;
            }
            let tapp;
            if (!isNaN(tappIndex)) {
                tapp = window.ChaynsInfo.Tapps[tappIndex].ShowName;
            } else {
                tapp = tappName;
                let internalNameMapping;
                for (let i = 0; i < window.ChaynsInfo.Tapps.length; i++) {
                    internalNameMapping = window.ChaynsInfo.Tapps[i];
                    // ReSharper disable once PossiblyUnassignedProperty
                    if (internalNameMapping.InternalName === tappName) {
                        // ReSharper disable once PossiblyUnassignedProperty
                        tapp = internalNameMapping.ShowName;
                        break;
                    }
                }
            }
            if (tapp != null) {
                let navItems = $('#NavItems>#scroller a,#NavItems>#scroller .NavItemDisabled');
                navItems.each(function (index, element) {
                    let elementHref = element.href;

                    if (!elementHref) {
                        elementHref = $(element).data('link');
                    }

                    if ($.trim($(element).text()) === tapp) {
                        window.Navigation.TappReloadParameter = paramsObj.Parameter || null;
                        window.Navigation.UpdateContent(elementHref);

                        if (reload) {
                            window.location.href = elementHref;
                        }
                        return false;
                    }
                    return true;
                });
            }
        } catch (e) {
            logger.log({
                exception: e.message,
                stacktrace: e.stack,
                section: 'selectothertab',
                type: logger.type.error,
                applicationname: 'CustomTappCommunicationsJs',
                tappId: window.Navigation.GetActiveTappID(),
                userAgent: navigator ? navigator.userAgent : 'no user agent',
                isMobile: !!window.ChaynsInfo.IsMobile,
                siteid: window.ChaynsInfo && window.ChaynsInfo.SiteID ? window.ChaynsInfo.SiteID : ''
            });
        }
    };

    module.selectalbum = params => {
        let url = window.Url.Content('~/Albums/GetAlbumID');
        //noinspection ES6ModulesDependencies
        $.getJSON(url, { albumName: params, locationID: window.ChaynsInfo.LocationID }, result => {
            if (result) {
                window.Navigation.UpdateContent(window.Url.Content('~/Albums/Pictures') + '?AlbumID=' + result);
            }
        });
    };

    module.loginfromadmin = () => {
        window.Login.facebookLogin(true, '', () => {
            window.Login.facebookLogin(false, '', '');
        });
    };

    module.showpicture = params => {
        let json;

        try {
            json = JSON.parse(params);
        } catch (e) {
            json = {};
            json.url = params;
        }

        window.ChaynsWeb.lightBox.init([{
            url: json.url,
            title: ''
        }]);

        window.ChaynsWeb.lightBox.show(0);
    };

    module.showvideo = params => window.ChaynsWeb.lightBox.openVideo(params);

    module.getwindowmetrics = (params, srcIframe) => {
        let headerHeight, scrollHeight;
        if (window.ChaynsInfo.IsMobile) {
            headerHeight = 45;
            scrollHeight = $(window).scrollTop();
        } else {
            scrollHeight = $(window).scrollTop();
            let pictureHeaderHeight = 70 + $('#PageHead').height();
            headerHeight = pictureHeaderHeight - scrollHeight;
            headerHeight = headerHeight < 0 ? 0 : headerHeight;
            scrollHeight -= pictureHeaderHeight - headerHeight;
        }

        parent.PostMessage('getWindowMetrics', JSON.stringify({
            AvailHeight: window.innerHeight - headerHeight,
            WindowScrollTop: scrollHeight,
            WindowInnerHeight: window.innerHeight,
            pageYOffset: pageYOffset
        }), srcIframe);
    };

    module.reloadwindow = () => top.location.reload();

    module.showhidetitleimage = params => {
        if (window.ChaynsInfo.IsMobile) {
            if (params === '1') {
                window.ChaynsWeb.hideCover();
            } else {
                window.ChaynsWeb.showCover();
            }
        } else {
            if (params === '1') {
                $('#PageHead').css('display', 'none');
            } else {
                $('#PageHead').css('display', '');
            }
        }
    };

    module.changecolor = function (params) {
        let splitParams = params.split(',');
        let colorSchemeName = splitParams[0];
        let isSoft = (splitParams[1] === 'true') ? 'soft' : 'default';
        let hex = splitParams[2];
        let $colorSchemeCss = $('#colorSchemeCss');
        let path = $colorSchemeCss.attr('href');
        path = path.replace(window.ChaynsInfo.ColorScheme.Name, colorSchemeName);
        path = path.replace((window.ChaynsInfo.ColorScheme.IsSoft ? 'soft' : 'default'), isSoft);
        path = path.replace((window.ChaynsInfo.ColorScheme.BaseColor).replace('#', ''), hex);
        let bgurl = document.body.getAttribute('backgroundImage');
        let styles = document.getElementsByTagName('link');

        if (bgurl !== undefined) {
            bgurl = bgurl.replace(window.ChaynsInfo.ColorScheme.Name, colorSchemeName);
            $('body').css('background-image', bgurl);
        }

        for (let i = 0; i < styles.length; i++) {
            if (styles[i].getAttribute('href').indexOf('/css/chayns')>0) {
                styles[i].setAttribute('href', styles[i].getAttribute('href').replace(window.ChaynsInfo.ColorScheme.BaseColor.replace('#', ''), hex));
            }
        }

        window.ChaynsInfo.ColorScheme.Name = colorSchemeName;
        window.ChaynsInfo.ColorScheme.BaseColor = '#' + hex;
        window.ChaynsInfo.ColorScheme.IsSoft = (isSoft === 'soft');
        $colorSchemeCss.attr('href', path);
    };

    module.logcomingsoonsettingschanged = function(params) {
        //noinspection ES6ModulesDependencies
        $.ajax({
            url: window.location.origin + window.Url.Content('~/ComingSoon/LogComingSoonStateChanged'),
            data: {
                state: params.indexOf('true') > -1
            }
        });
    };

    module.changemenuposition = function (params) {
        let position = params;
        let $navigation = $('#Navigation');
        let $bodyContent = $('#BodyContent');
        let nav;

        $navigation.css('display', 'table-cell');
        $bodyContent.css('width', '');

        if (position === '0') {
            nav = $navigation;
            $('Navigation').remove();
            $('#BodyContentCell').before(nav);

        }

        if (position === '1') {
            nav = $navigation;
            $('Navigation').remove();
            $('#BodyContentCell').after(nav);
        }

        if (position === '2') {
            $navigation.css('display', 'none');
            $bodyContent.css('width', '100%');
        }
    };

    module.tobitlogin = function (params) {
        window.Login.tobitLogin(params);
    };

    module.facebooklogin = () => window.Login.facebookLogin(false, '', () => window.Login.facebookLogin(false, '', ''));

    module.setiframefullheight = (params, srcIframe) => {
        function applyFullHeight() {
            let $iframe = window.ChaynsWeb.CustomTappIframe[0];
            let headerHeight;
            let h;
            let $appHintBox = $('#AppHintBox');
            let $domainOfferAttention = $('.domainOfferAttention');
            let $titleConnect = $('#TitleConnect');

            if (window.ChaynsInfo.IsMobile) {
                headerHeight = $appHintBox.is(':visible') ? $appHintBox.height() : 0;
                headerHeight += $('#HeaderBar').height();
                h = $(window).height() - headerHeight;
                if (!window.ChaynsInfo.IsMobile) {
                    $('#PageBody').height($(window).height());
                }
            } else {
                headerHeight = $('#PageHead').height() + ($domainOfferAttention.outerHeight() || 0);
                let minHeight = $(window).height() - headerHeight - 35;
                let maxHeight = $('#NavItems').height() + 45;

                if (minHeight > maxHeight) {
                    maxHeight = minHeight;
                }

                h = minHeight + $(window).scrollTop();
                if (h > maxHeight) {
                    h = maxHeight;
                } else {
                    h = h - 25;
                }

                let wh = $(window).height() - ($domainOfferAttention.outerHeight() || 0) - $titleConnect.height();

                if (h > wh) {
                    let t = h - wh - 35 + $titleConnect.height() - 80;
                    h = wh - $titleConnect.height() + 80;
                    $iframe.css('marginTop', t);
                } else {
                    $iframe.css('marginTop', -35);
                }
            }
            $iframe.height(h);
            parent.PostMessage('setHeight', JSON.stringify(h), srcIframe);
        }

        $('#BodyContent').css('marginBottom', 0);
        $('#BodyContentCell').css('paddingBottom', 0);
        $('#Navigation').css('min-height', 0);
        applyFullHeight();
        $(window).on('scroll.fullHeight', applyFullHeight);
        $(window).on('resize.fullHeight', applyFullHeight);
    };

    module.showdialog = () => {

    };

    module.multiselectdialog = (params, srcIframe) => {
        params = JSON.parse(params);
        let type = 'hint';
        let json = params[1];
        json.Callback = params[0];

        if (srcIframe) {
            json.SrcIframe = srcIframe;
        }

        if (params.length > 2) {
            json.Items = params[2];
            type = 'selection';
        }

        new Dialog(json, type);
    };

    module.iframedialog = (params, srcIframe) => {
        params = JSON.parse(params);
        let type = 'iframe';
        let json = params[1];
        json.Callback = params[0];

        if (srcIframe) {
            json.SrcIframe = srcIframe;
        }

        new Dialog(json, type);
    };

    module.overlay = params => {
        params = JSON.parse(params);
        Overlay(params);
    };

    module.selectfacebookfriends = (params, srcIframe) => {
        params = JSON.parse(params);
        let json = params[1];
        json.Callback = params[0];
        json.FacebookIds = params[2];

        if (srcIframe) {
            json.SrcIframe = srcIframe;
        }

        new Dialog(json, 'facebook');
    };

    module.formdialog = (params, srcIframe) => {
        params = JSON.parse(params);
        let json = params[1];
        json.Callback = params[0];

        if (srcIframe) {
            json.SrcIframe = srcIframe;
        }

        new Dialog(json, 'form');
    };

    module.datepicker = (params, srcIframe) => {
        params = JSON.parse(params);
        let json = params[5] || {};
        json.Callback = params[0];
        json.Timestamp = params[2] || -1;
        json.TimeMode = params[1] || 1;
        json.MinTimestamp = params[3] || -1;
        json.MaxTimestamp = params[4] || -1;

        if (srcIframe) {
            json.SrcIframe = srcIframe;
        }

        new Dialog(json, 'datepicker');
    };

    module.showdomainofferdialog = params => {
        let json;

        //noinspection ES6ModulesDependencies,Eslint
        if (is.not.empty(params)) {
            json = JSON.parse(params);
        }

        window.ChaynsWeb.showDomainOfferDialog(json || undefined);
    };

    module.domainofferfinished = param => {
        if (typeof param === 'string') { //call from PostMessage
            $('.dialogBody .chaynsBtn').first().click(); //dialog schließen
        }

        if (module.domainoffercallback.callBackURL) {
            //noinspection ES6ModulesDependencies
            $.getJSON(window.CustomTappCommunication.Functions.domainoffercallback.callBackURL);
            module.domainoffercallback.callBackURL = '';
        }

        $('.domainOfferAttention').slideUp(() => {
            $(this).remove();
        });

        $('#TitleConnectBg, #TitleConnect').animate({ top: 0 });
        $('#MainFrame').animate({ marginTop: '75px' });

        //noinspection Eslint
        if (is.existy(param)) {
            parent.PostMessage('registeredDomain', param);
        }
    };

    module.domainoffercallback = param => module.domainoffercallback.callBackURL = param;

    module.changebackgroundimage = params => {
        let data = JSON.parse(params);
        let $body = document.body;

        if (data.URL && data.URL !== '') {
            data.URL = data.URL.replace('##csid##', window.ChaynsInfo.ColorScheme.Name);
            $body.style.backgroundImage = `url('${data.URL}?t=${new Date().getTime()}')`;
        }

        //noinspection JSUnresolvedVariable
        if (data.ShowAsTexture) {
            $body.style.backgroundRepeat = 'repeat';
            $body.style.backgroundSize = '';
        } else {
            $body.style.backgroundRepeat = '';
            $body.style.backgroundSize = 'cover';
        }
    };

    module.logout = () => window.Login.logout();

    module.alert = param => {
        if (typeof param === 'string') {
            //noinspection Eslint
            alert(param);
        }
    };

    module.redirecttochayns = param => {
        if (typeof param === 'string') {
            param = JSON.parse(param);
        }

        if (!param.OverrideToken && (param.FBAccessToken || param.TobitAccessToken)) {
            param.OverrideToken = true;
        }

        let tobitAccessToken = '';

        if (window.ChaynsInfo.User.TobitAccessToken !== '' || !param.OverrideToken) {
            tobitAccessToken = window.ChaynsInfo.User.TobitAccessToken;
        } else if (param.TobitAccessToken !== undefined && param.TobitAccessToken !== '') {
            tobitAccessToken = param.TobitAccessToken;
        }

        let accessToken = '';
        if (window.Facebook.accessToken !== '' || !param.OverrideToken) {
            accessToken = window.Facebook.accessToken;
        } else if (param.FBAccessToken !== undefined && param.FBAccessToken !== '') {
            accessToken = param.FBAccessToken;
        }

        if (param.SiteID === undefined) {
            param.SiteID = '';
        }

        if (param.URL === undefined) {
            param.URL = '';
        }

        $('<form>', {
            'id': 'gotoSite',
            'html': `<input type="text" name="accessToken" value="${accessToken}" /><input type="text" name="TobitAccessToken" value="${tobitAccessToken}" />`,
            'action': `//chayns.net/${param.SiteID}/${param.URL}`,
            'method': 'post',
            'target': '_top'
        }).appendTo(document.body).submit();
    };

    module.notapp = () => {
        if (window.ChaynsInfo.User.TobitAccessToken === '') {
            //noinspection JSUnresolvedVariable
            if (window.localStorageExists) {
                localStorage.setItem('window.Login.TappForward-' + window.ChaynsInfo.SiteID, location.pathname);
            }

            window.Login.showDialog();
        }

        let $tapp = window.ChaynsWeb.customTapp.getFirstVisibleTapp();
        if (!$tapp) {
            $tapp = document.querySelector('.NavItem[data-tappid="93"]');
        }
        $tapp.click();

        if (window.ChaynsInfo.IsMobile) {
            window.Navigation.ToggleNavigation();
        }
    };

    module.refreshnavigation = param => window.ChaynsWeb.RefreshNavigation(param);

    module.chaynscall = function(param, srcIframe) {
        let value;
        let action;

        if (typeof (param) === 'string') {
            try {
                let temp = JSON.parse(param);
                value = temp.value;
                action = temp.action;
            } catch (e) {
                window.JsonCalls.Helper.throw(window.NaN, 4, 'Error parsing JSON', param, srcIframe);
                return;
            }
        } else if (typeof (param) === 'object' && param.action !== undefined) {
            value = param.value;
            action = param.action;
        } else {
            window.JsonCalls.Helper.throw(window.NaN, 2, 'Field action missing', param, srcIframe);
            return;
        }

        if (typeof value !== 'object' && typeof value === 'string') {
            try {
                value = JSON.parse(value);
            } catch (e) {
                window.JsonCalls.Helper.throw(action, 4, 'Error parsing JSON', param, srcIframe);
                return;
            }
        }
        if (typeof window.JsonCalls[action] === 'function') {
            window.JsonCalls[action](value, srcIframe);
        } else {
            window.JsonCalls.Helper.throw(action, 3, 'chaynsCall ' + action + ' doesn\'t exist', value, srcIframe);
        }
    };

    module.alternativefblogin = function(param) {
        window.Login.AlternativeFbLogin(param);
    };

    module.closeloginoverlay = function() {
        $('.overlayCloser').click();
        window.CustomTappCommunication.Functions.showloadingcursor();
    };

    module.jsoncall = module.chaynscall;

})(window.CustomTappCommunication.Functions = {}, window.CustomTappCommunication);

$(document).ready(window.CustomTappCommunication.Init);