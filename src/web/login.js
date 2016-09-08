import {ApplyUnsafeFunction, utf8Decode} from '../shared/utils/chaynsWeb';
import WaitCursor from '../shared/wait-cursor';

window.Login = (function (module, window, jquery) {
    var TobitAccessTokenLocalStorage = `TobitAccessToken_${window.ChaynsInfo.SiteID}`;
    var LoginRequest = {
        'TobitAccessToken': '',
        'NextTappID': '',
        'StayLoggedIn': '',
        'Referrer': '',
        'TappReloadParameter': '',
        'IsAutoLogin': false,
        'LocationID': window.ChaynsInfo.LocationID,
        'FbAccessToken': null,
        'AdminMode': window.ChaynsInfo.AdminMode
    };

    var TobitAccessToken = null;

    var LoginParams = {
        ExecCommand: null,
        ReloadParams: null
    };

    function persistLoginParams() {

    }

    var Running = false;

    function decodeTobitAccessToken(tobitAccessToken) {
        if (tobitAccessToken && typeof (tobitAccessToken) === 'string' && tobitAccessToken.length > 0) {
            var spl = tobitAccessToken.split('.');
            if (spl.length === 3) {
                try {
                    spl[1] = spl[1].slice(0, spl[1].length + (spl[1].length % 4));
                    spl[1] = spl[1].replace(/-/g, '+').replace(/_/g, '/');

                    return JSON.parse(utf8Decode(atob(spl[1])));
                } catch (e) {
                    //TODO Logging
                }
            }
        }
        return null;
    }

    function userLoginChanged(tapp, openAdministration, noRefreshLogin, noRappReload) {

    }

    function setTobitAccessToken(tobitAccessToken) {
        var tokenObj = decodeTobitAccessToken(tobitAccessToken);

        if (new Date(tokenObj.exp) > new Date()) {
            LoginRequest.TobitAccessToken = tobitAccessToken;
            LoginRequest.FbAccessToken = window.Facebook.accessToken;
            LoginRequest.AdminMode = window.ChaynsInfo.AdminMode === true;

            // window.ChaynsWeb.serverRequest(
            //     'POST',
            //     window.location.origin + window.Url.Content('~/Session/TobitLogin'),
            //     LoginRequest,
            //     false,
            //     function (resp) {
            //         //noinspection JSUnresolvedVariable
            //         if (resp.Status > -1) {
            //             window.ChaynsInfo.User.TobitAccessToken = tobitAccessToken;
            //             var userObject = decodeTobitAccessToken(tobitAccessToken);
            //
            //             window.ChaynsInfo.User.FirstName = userObject.FirstName;
            //             window.ChaynsInfo.User.LastName = userObject.LastName;
            //             window.ChaynsInfo.User.ID = userObject.TobitUserID;
            //             window.ChaynsInfo.User.PersonID = userObject.PersonID;
            //             window.ChaynsInfo.User.IsAdmin = userObject.IsAdmin;
            //             //noinspection JSUnresolvedVariable
            //             window.Facebook.uid = userObject.FacebookUserID;
            //             window.Facebook.name = `${window.ChaynsInfo.User.FirstName} ${window.ChaynsInfo.User.LastName}`;
            //             window.ChaynsInfo.User.UACGroups = resp.UACGroups;
            //             window.ChaynsInfo.Tapps = resp.Tapps;
            //             window.ChaynsInfo.AdminMode = resp.AdminMode;
            //             //noinspection JSUnresolvedVariable
            //             window.ChaynsInfo.User.HasAltPicture = resp.HasAltUserImg;
            //             //noinspection JSUnresolvedVariable
            //             if (window.localStorageExists) {
            //                 localStorage.removeItem(TobitAccessTokenLocalStorage);
            //                 localStorage.setItem(TobitAccessTokenLocalStorage, tobitAccessToken);
            //             }
            //             dialogDisabled = false;
            //             WaitCursor.hide();
            //             userLoginChanged();
            //
            //             var $titleLogin = document.getElementById('TitleLogin');
            //             if ($titleLogin) {
            //                 $titleLogin.classList.add('TitleLoginHide');
            //             }
            //
            //             chaynsId.loadChaynsIdIcons();
            //             if (document.getElementById('ChaynsIDFrame')) {
            //                 chaynsId.init();
            //             }
            //         }
            //     },
            //     function () {
            //         window.ChaynsInfo.User.TobitAccessToken = '';
            //
            //         window.ChaynsInfo.User.FirstName = '';
            //         window.ChaynsInfo.User.LastName = '';
            //         window.ChaynsInfo.User.ID = '';
            //         window.ChaynsInfo.User.PersonID = '';
            //         window.ChaynsInfo.User.IsAdmin = null;
            //         window.Facebook.uid = '';
            //         window.Facebook.name = '';
            //         window.ChaynsInfo.User.UACGroups = '';
            //         window.ChaynsInfo.Tapps = '';
            //
            //         //noinspection JSUnresolvedVariable
            //         if (window.localStorageExists) {
            //             localStorage.removeItem(TobitAccessTokenLocalStorage);
            //         }
            //
            //         dialogDisabled = false;
            //         WaitCursor.hide();
            //         if(dialogRequested){
            //             window.Login.showDialog();
            //         }
            //     });
        } else {
            setTobitAccessToken('');
        }
    }

    function generateTobitLoginFromFB(accessToken, callback) {
        //Tobit.Auth.PerformFB
        var model = {
            'LocationID': window.ChaynsInfo.LocationID,
            'AccessToken': accessToken
        };

        //noinspection JSUnresolvedVariable,JSUnresolvedFunction
        window.TobitAuth.PerformFb(model, function (result) {
            //noinspection JSUnresolvedVariable
            if (result !== null && result !== undefined && result.Status > 0) {
                window.Facebook.accessToken = accessToken;
                setTobitAccessToken(result.TobitAccessToken);
                if (typeof callback === 'function') {
                    ApplyUnsafeFunction(callback);
                }
            } else {
                setTobitAccessToken('');
                module.showDialog();
                WaitCursor.hide();
            }
        });
    }

    module.AlternativeFbLogin = accessToken => generateTobitLoginFromFB(accessToken, null);

    module.facebookLogin = (directLogin, permissions, directLoginErrorCb) => {
        setTimeout(function() {
            if (!window.fbinitialized) {
                console.error('facebook is not initialized');
            }
        }, 10000);

        Running = true;
        WaitCursor.show();

        //$.fancybox.close();
        var callback;
        if (typeof directLogin === 'function') {
            callback = directLogin;
            directLogin = false;
        }

        window.TFB.ready(() => {
            TobitAccessToken = null;
            if (directLogin) {
                var cachedStatus = window.TFB.getCachedStatus();

                // console.log('1');
                if (!cachedStatus || cachedStatus.status !== 'connected') {
                    ApplyUnsafeFunction(directLoginErrorCb, cachedStatus);
                    return;
                }
            }

            window.TFB.getLoginStatus(function (resp) {
                    //noinspection JSUnresolvedVariable
                    window.Facebook.uid = resp.authResponse.userID;
                    //noinspection JSUnresolvedVariable
                    generateTobitLoginFromFB(resp.authResponse.accessToken, callback);
                },
                function () {
                    setTobitAccessToken('');
                    logoutPageMenu();
                },
                permissions ? {scope: permissions} : null,
                true /*Login Dialog zeigen*/);
        });
    };

    module.tobitLogin = params => {
        Running = true;
        var paramsObj;
        try {
            paramsObj = JSON.parse(params);
        } catch (es) {
            paramsObj = params;
        }
        params = paramsObj;

        $('.overlayCloser').click();
        WaitCursor.show();

        TobitAccessToken = null;

        var loginModel = {
            'Alias': params.Alias,
            'Password': params.Password,
            'SiteId': window.ChaynsInfo.SiteID,
            'LocationId': window.ChaynsInfo.LocationID
        };

        //noinspection JSUnresolvedVariable
        window.TobitAuth.Login(loginModel, result => {
            if (result != null) {
                //noinspection JSUnresolvedVariable
                var statusCode = result.Status;

                //noinspection JSUnresolvedVariable,JSUnresolvedFunction
                if (window.TobitAuth.IsSuccess(statusCode)) {
                    TobitAccessToken = result.TobitAccessToken;
                    setTobitAccessToken(TobitAccessToken);
                    $('.overlayCloser').click();
                } else {
                    WaitCursor.hide();
                    var dialogMsg;
                    //noinspection JSUnresolvedVariable
                    if (statusCode === window.TobitAuth.ResponseStatus.ERROR_USER_NOT_AUTHENTICATED) {
                        dialogMsg = window.chayns.utils.lang.get('txt_chayns_login_error_email_pw_wrong');
                    } else {
                        //noinspection JSUnresolvedVariable
                        if (statusCode === window.TobitAuth.ResponseStatus.ERROR_EMAIL_NOT_VALIDATED) {
                            dialogMsg = window.chayns.utils.lang.get('txt_chayns_login_error_email_not_validated');
                        } else {
                            dialogMsg = window.chayns.utils.lang.get('txt_chayns_login_error_generic');
                        }
                    }

                    // new Dialog({
                    //     Headline: '',
                    //     Text: dialogMsg,
                    //     Buttons: [
                    //         {
                    //             Text: 'OK',
                    //             Value: 0
                    //         }
                    //     ],
                    //     Callback: () => {
                    //         //module.showDialog();
                    //     }
                    // });
                }
            }
        });
    };

    module.reLogin = disableCheck => {

    };

    function logoutPageMenu() {
        try {
            var curIFrame = document.getElementById('PageMenuIframeDiv');
            if (curIFrame !== null) {
                curIFrame.innerHTML = '';
            }
            $('#HiddenPageMenuFrame').attr('src', 'about:blank');
        } catch (e) {
            //TODO Logging
        }
    }

    module.logout = type => {
        if (type === 1) {
            setTobitAccessToken('');
            logoutPageMenu();
        } else {
            /*
            new Dialog({
                Text: window.chayns.utils.lang.get('txt_chayns_login_logout_text'),
                Buttons: [
                    {
                        Text: 'OK',
                        Value: 1
                    },
                    {
                        Text: 'Abbrechen',
                        Value: 0
                    }],
                Callback: function (val) {
                    // console.log(val);
                    if (val === 1) {
                        //Invalidate Session
                        //noinspection JSUnresolvedVariable
                        if (typeof window.ChaynsWeb.HideChaynsIdFrame == 'function') {
                            //noinspection JSUnresolvedFunction
                            window.ChaynsWeb.HideChaynsIdFrame(true);
                        }

                        WaitCursor.show();
                        chaynsId.hideFrame(true);
                        setTobitAccessToken('');
                        logoutPageMenu();

                        $('#ChaynsIdIcons').css('margin-right', '-200px');
                        $('#NavButton').removeClass('ChaynsIdMarker');

                        var $titleLogin = document.getElementById('TitleLogin');
                        if ($titleLogin) {
                            $titleLogin.classList.remove('TitleLoginHide');
                        }

                        //noinspection JSUnresolvedVariable
                        if (!window.ChaynsInfo.IsComingSoon) {
                            var $tapp = window.ChaynsWeb.customTapp.getFirstVisibleTapp();
                            if (!$tapp) {
                                $tapp = document.querySelector(`.NavItem[data-tappid='93']`);
                            }
                            $tapp.click();
                        }
                    }
                }
            });
            */
        }
    };

    module.setUserMode = (modeId, openAdministration, noRefreshLogin, noTappReload) => {
    };

    module.showDialog = params => {
    };

    /**
     * @return {boolean}
     */
    module.Running = () => Running;

    module.setReloadParams = params => {
        LoginParams.ReloadParams = params || null;
        persistLoginParams();
    };

    module.getReloadParams = () => LoginParams.ReloadParams || [];

    return module;

})(window.Login = {}, window);