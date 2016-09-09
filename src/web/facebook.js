import {ApplyUnsafeFunction} from '../shared/utils/helper';

window.Facebook = window.Facebook || {};

(function () {
    if (this.initialized) {
        return;
    }

    var that = this;

    //private Variablen

    //public Variablen
    //noinspection JSUnresolvedVariable
    this.initialized = false;

    if (!this.appid) {
        this.appid = '';
    }

    if (!this.uid) {
        this.uid = '';
    }

    if (!this.accessToken) {
        this.accessToken = '';
    }

    if (!this.sdkurl) {
        this.sdkurl = '//connect.facebook.net/en_US/all.js#xfbml=1&version=v2.3';
    }

    this.Init = function () {
        if (that.initialized) {
            return;
        }

        that.initialized = true;

        window.TFB.init(that.GetFbInitArgs());
    };

    //noinspection JSUnusedGlobalSymbols
    this.loggedIn = function () {
        return this.uid !== '';
    };

    this.GetFbInitArgs = function () {
        return {
            appId: that.appid,
            xfbml: false,
            version: 'v2.0',
            cookie: true,
            status: false
        };
    };

    this.Login = function (args) {
        args = args || {
                permissions: null,
                nextTappID: null,
                tappReloadParameter: null,
                directLogin: null,   //boolean oder object mit error-callback
                referrer: null
            };

        // let $fbLoginForm = $('#FbLoginForm');
        // args.nextTappID = args.nextTappID || $('.NextTappID').val() || $('.NavItem.active').data('tappid');
        // args.permissions = args.permissions || $fbLoginForm.find('.Permissions').val();
        // args.tappReloadParameter = args.tappReloadParameter || $('.TappReloadParameter').val();

        let $fbLoginForm = $('#FbLoginForm');
        args.nextTappID = args.nextTappID ||0;
        args.permissions = args.permissions || '';
        args.tappReloadParameter = args.tappReloadParameter || '';

        var submit = function () {
            // if (args.nextTappID) {
            //     $('.NextTappID').val(args.nextTappID);
            // }
            // if (args.referrer) {
            //     $('.Referrer').val(args.referrer);
            // }
            //
            // if (args.tappReloadParameter) {
            //     $('.TappReloadParameter').val(args.tappReloadParameter);
            // }

            $fbLoginForm.submit();
        };

        window.TFB.ready(function () {

            if (args.directLogin) {
                var cachedStatus = window.TFB.getCachedStatus();
                if (!cachedStatus || cachedStatus.status !== 'connected') {
                    ApplyUnsafeFunction(args.directLogin.error, cachedStatus);
                    return;
                }
            }

            window.TFB.getLoginStatus(function (resp) {
                    //noinspection JSUnresolvedVariable
                    $('#FbLoginForm').find('.Password').val(resp.authResponse.accessToken);
                    submit();
                },
                function () {
                    submit();
                },
                args.permissions ? {scope: args.permissions} : null,
                true /*Login Dialog zeigen*/);
        });

    };

    this.ShowLoginDlg = function (permissions, tappReloadParams) {
        let $fbLoginForm = $('#FbLoginForm');

        $fbLoginForm.find('.Permissions').val(permissions || '');
        $fbLoginForm.find('.TappReloadParameter').val(tappReloadParams || '');

        if (!window.ChaynsInfo.Login) {
            window.ChaynsInfo.Login = {};
        }

        window.ChaynsInfo.Login.logintype = 'facebook';

        window.Login.showDialog();
    };

    //noinspection JSUnusedGlobalSymbols
    this.DirectLogin = function (referrer) {
        window.Facebook.Login(
            {
                directLogin: {
                    error: function () {
                        window.Navigation.UpdateContent(window.Url.Content('~/Login'), true);
                    }
                },
                referrer: referrer
            });
    };

}).apply(window.Facebook);

document.addEventListener('DOMContentLoaded', () => {
    window.Facebook.Init();
}, false );