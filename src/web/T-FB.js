if (!window.TFB)
    (function () {
        //---------------------------------------------- 
        //---private Properties
        //----------------------------------------------
        var initialized = false;
        var apiLoaded = false;
        var /*TFB.LogPriority*/tfbDebugLvl = 50; //sollte nur zum Debuggen auf 0 stehen, sonst min. 50 oder -1
        var channelUrl = null;
        var accessToken = "";
        var accessTokenExpiringTime = null;
        var loginStatus = null;
        var eventFunctions = {
            ready: [],     //wird einmalig bei einem init ausgeführt und dann geleert
            staticInit: [], //wird bei jedem erfolgreichen init ausgeführt und nie geleert (außer bei unbind)
            getLoginStatusSuccess: [],
            getLoginStatusError: [],
            apiSuccess: [],
            apiError: []
        };
        var currentAppId = null;
        var fufProperties = {}; //fuf = frequently used functions

        function _strTrim(str) {
            if (typeof str !== "string") return str;
            return str.replace(/^\s+|\s+$/g, "");
        }

        function _strArrTrim(strArr) {
            if (strArr == null) return;

            for (var s in strArr) {
                strArr[s] = _strTrim(strArr[s]);
            }
        }

        //----------------------------------------------
        //---private Functions
        //----------------------------------------------
        function _loadApi(initializeFb, fbArgs) {
            //window.fbAsyncInit wird vom Facebook SDK aufgerufen
            window.fbAsyncInit = function () {
                apiLoaded = true;

                if (initializeFb) {
                    fbInit(fbArgs);
                }
            };

            //Nachladen von Facebook API
            (function (d, s, id) {
                var js, fjs = d.getElementsByTagName(s)[0];
                if (d.getElementById(id)) return;
                js = d.createElement(s); js.id = id; js.async = true;
                js.src = TFB.sdkUrl;
                fjs.parentNode.insertBefore(js, fjs);
            }(document, 'script', 'facebook-jssdk'));
        }

        function fbInit(fbArgs) {
            FB.init(fbArgs);

            if (!initialized) {
                execUnsafeFunction(FB.Canvas.setAutoGrow);
            }

            initialized = false;
            window.fbinitialized = false;

            TFB.getLoginStatus(function (resp) {
                    if (!initialized || !window.fbinitialized) {
                        initialized = true;
                        window.fbinitialized = true;

                        execUnsafeFunction(FB.Canvas.setAutoGrow);

                        TFB.trigger("staticInit", [fbArgs, resp]);
                        execReadyFunctions();
                    }
                },
                undefined,
                true,
                false
            );
        };

        //übergibt an die Funktion ggf. args als Parameter (wenn args ein Array ist, stellen die Elemente von args die Parameter dar)
        function execUnsafeFunction(args /*optional*/, func) {
            var params = undefined;

            if (typeof args !== "function") {
                params = args;
            }
            else {
                func = args;
            }

            if (typeof func === "function") {
                try {
                    if (params instanceof Array) {
                        func.apply(undefined, params);
                    }
                    else {
                        func.call(undefined, params);
                    }
                }
                catch (ex) {
                    TFB.log(ex, TFB.LogPriority.High);
                }
            }
            else {
                return false;
            }

            return true;
        };

        //führt den ersten Parameter aus, der den Typ "function" hat
        //übergibt an den Callback ggf. args als Parameter (wenn args ein Array ist, stellen die Elemente von args die Parameter dar)
        function execCallback(args /*optional*/, func1 /*, func2, ...*/) {
            var i = 0;
            var params = undefined;

            if (typeof args !== "function") {
                params = args;
                i = 1;
            }

            for (; i < arguments.length; i++) {
                if (typeof arguments[i] === "function") {
                    execUnsafeFunction(params, arguments[i]);

                    break;
                }
            }
        };

        function execReadyFunctions() {
            TFB.log("execReadyFunctions", TFB.LogPriority.Low);

            TFB.trigger("ready", loginStatus);

            eventFunctions.ready.splice(0, eventFunctions.ready.length);
        };

        function getAccessToken() {
            if (Facebook.accessToken === "")
                Facebook.accessToken = TFB.accessToken;
            return Facebook.accessToken;
        }

        function execLoginCallback(success, error, ignoreUnknown, cached) {
            var callback = null;
            var isError = true;

            if (loginStatus) {
                if (loginStatus.status == "connected") {
                    callback = success;
                    loginStatus.isConnected = true;
                    isError = false;
                }
                else {
                    loginStatus.isConnected = false;

                    if (loginStatus.status == "not_authorized") {
                        callback = (typeof error === "function") ? error : success;
                    }
                }
            }

            if (callback == null && !ignoreUnknown) {
                callback = (typeof error === "function") ? error : success;
            }

            if (!cached && isError) {
                TFB.trigger("getLoginStatusError", [loginStatus, currentAppId]);
            }
            else if (!cached) {
                TFB.trigger("getLoginStatusSuccess", [loginStatus, currentAppId]);
            }

            return execUnsafeFunction(loginStatus, callback);
        };

        //Error Codes: https://github.com/phwd/fbec
        function handleApiError(/*FB.ApiResponse*/resp,
                                /*String*/path,
                                /*String*/method,
                                /*Object*/params,
                                /*Callback*/success,
                                /*Callback*/error,
                                /*Boolean oder Object mit getLoginStatus-Parameter*/login) {
            TFB.log("handleApiError", TFB.LogPriority.Low);
            var handled = false;

            if (resp && resp.error && resp.error.code) {
                var errorCode = resp.error.code;

                switch (errorCode) {
                    //erst einmal auskommentiert. müsste man sich noch einmal ein bisschen mehr mit beschäftigen, ob es noch irgendwelche Probleme geben könnte                                                              
                    //            case 190 /*AccessToken Problem*/:                                                              
                    //               //Funktion noch einmal mit TFB.getLoginStatus aufrufen - Es wird kein Login-Dialog angezeigt, da er von Popup Blockern geblockt werden würde                                                              
                    //               if(!login)                                                              
                    //               {                                                              
                    //                  TFB.api(path, method, params, success, error, false, TFB.accessTokenExpired());                                                              
                    //                  handled = true;                                                              
                    //               }                                                              
                    //               break;                                                              
                    default: break;
                }
            }

            if (!handled) {
                execCallback(resp, error, success);
            }
            else {
                TFB.log("ApiError handled");
            }
        };

        //----------------------------------------------
        //---TFB Objekt
        //----------------------------------------------
        window.TFB = {
            //public Properties
            channelUrl: null,
            sdkUrl: "//connect.facebook.net/de_DE/sdk.js",//"#xfbml=1&version=v2.3",
            //public enums
            LogPriority: {
                VeryHigh: 1000,
                High: 100,
                Normal: 50,
                Low: 0,
                NoLogs: -1
            },
            //----------------------------------------------
            //---Funktionen für Initialisierung
            //----------------------------------------------
            loadApi: function () {
                _loadApi();
            },
            init: function (fbArgs) {
                if (apiLoaded && !window.FB) {
                    TFB.log("Facebook JavaScript SDK nicht gefunden!", TFB.LogPriority.VeryHigh);
                }
                else if (!apiLoaded && window.FB) {
                    apiLoaded = true;
                }

                if (typeof fbArgs !== "object") {
                    fbArgs = {};
                }

                if (!TFB.channelUrl && location.protocol && location.host) {
                    TFB.channelUrl = location.protocol + "//" + location.host + "/Include/SocialNetworks/channel.htm";
                }

                fbArgs.status = false;     //wird immer manuell gemacht, damit man einen Callback bekommt
                if (fbArgs.cookie == null)
                    fbArgs.cookie = true;   // enable cookies to allow the server to access the session
                //if (fbArgs.xfbml == null)
                fbArgs.xfbml = true;    // parse XFBML
                if (fbArgs.logging == null)
                    fbArgs.logging = tfbDebugLvl <= TFB.LogPriority.Normal && tfbDebugLvl > TFB.LogPriority.NoLogs;
                if (fbArgs.channelUrl == null)
                    fbArgs.channelUrl = TFB.channelUrl;
                fbArgs.version = "v2.3";
                if (fbArgs.frictionlessRequests == null)
                    fbArgs.frictionlessRequests = false;

                if (initialized && currentAppId == fbArgs.appId) {
                    return;
                }

                currentAppId = fbArgs.appId;
                loginStatus = null;
                accessTokenExpiringTime = null;
                fufProperties = {};

                //FBinit
                if (apiLoaded) {
                    fbInit(fbArgs);
                }
                else {
                    _loadApi(true, fbArgs);
                }
            },
            ready: function (handler) {
                if (typeof handler !== "function") return;

                if (initialized) {
                    TFB.log("exec handler", TFB.LogPriority.Low);
                    execUnsafeFunction(loginStatus, handler);
                }
                else {
                    TFB.bind("ready", handler);
                }
            },
            logout: function (callback) {
                FB.logout(callback);
            },
            login: function (callback) {
                FB.login(callback);
            },
            bind: function (eventType, handler) {
                if (typeof eventType !== "string" || typeof handler !== "function") return;

                TFB.log("store " + eventType + " handler", TFB.LogPriority.Low);

                if (!(eventFunctions[eventType] instanceof Array)) {
                    eventFunctions[eventType] = [];
                }

                eventFunctions[eventType].push(handler);
            },
            unbind: function (eventType, handler) {
                if (typeof eventType !== "string") return;

                var funcArray = eventFunctions[eventType];

                if (!(funcArray instanceof Array)) return;

                for (var i = 0; i < funcArray.length; i++) {
                    if (funcArray[i] == handler) {
                        funcArray.splice(i, 1);
                        i--;
                    }
                }
            },
            trigger: function (eventType, params) {
                if (typeof eventType !== "string") return;

                var funcArray = eventFunctions[eventType];

                if (!(funcArray instanceof Array)) return;

                for (var i = 0; i < funcArray.length; i++) {
                    execUnsafeFunction(params, funcArray[i]);
                }
            },
            //----------------------------------------------
            //---GETTER
            //----------------------------------------------
            getAppId: function () {
                return currentAppId;
            },
            getDebugLvl: function () {
                return tfbDebugLvl;
            },
            //----------------------------------------------
            //---SETTER
            //----------------------------------------------
            setDebugLvl: function (value) {
                if (value != null && !isNaN(value)) {
                    tfbDebugLvl = value;
                }
            },
            //----------------------------------------------
            //---Main Funktionen
            //----------------------------------------------
            //wenn keine error Funktion übergeben wird, wird immer die success Funktion aufgerufen
            //allowLoginDialog nur nach onclick-Event setzen! (sonst wird das Popup ggf. vom Browser geblockt)
            getLoginStatus: function (success, error /*optional*/, opts, allowLoginDialog) {  //TODO: Problem beheben: FB.login aktualisiert sich nicht immer und kann nicht geforced werden
                //möglichst immer erst versuchen getLoginStatus zu verwenden, dann ggf. Dialog mit Button anzeigen?!
                TFB.log("TFB.getLoginStatus", TFB.LogPriority.Low);
                if (error != null && typeof error !== "function") {  //Parameter nach rechts verschieben
                    allowLoginDialog = opts;
                    opts = error;
                    error = null;
                }

                if (!opts && !TFB.accessTokenExpired() && execLoginCallback(success, error, true, true)) {
                    return;
                }

                var loginWithScope = opts && (typeof opts.scope === "string");

                var method = FB.getLoginStatus;

                if (allowLoginDialog || loginWithScope) {
                    TFB.log("FB.login", TFB.LogPriority.Low);
                    method = FB.login;
                    if (typeof opts !== "object") {
                        opts = null;
                    }
                }
                else {
                    TFB.log("force FB.getLoginStatus", TFB.LogPriority.Low);
                    opts = true; //force Reload
                }

                method(function (resp) {
                    if (resp && resp.authResponse && resp.authResponse.expiresIn) {
                        accessTokenExpiringTime = new Date().getTime() + resp.authResponse.expiresIn * 1000;
                    }
                    if (loginWithScope && TFB.hasCachedPermissions()) {
                        TFB.getPermissions(true);
                    }
                    loginStatus = resp;
                    execLoginCallback(success, error, false, false);
                }, opts);
            },
            getCachedStatus: function () {
                return loginStatus;
            },
            accessTokenExpired: function () {
                var ret = true;

                if (accessTokenExpiringTime != null && accessTokenExpiringTime > (new Date().getTime() + 30000)) {
                    ret = false;
                }

                return ret;
            },
            //TFB.api genauso nutzbar wie FB.api
            api: function (/*String*/path,
                           /*String*/method /*optional*/,
                           /*Object*/params /*optional*/,
                           /*Callback*/success,
                           /*Callback*/error /*optional*/,
                           /*Boolean*/handleError,
                           /*Boolean oder Object mit getLoginStatus-Parameter*/login
            ) {
                if (typeof path !== "string") {
                    TFB.log("TFB.api Error - path must be a string:");
                    TFB.log(path);
                    return;
                }

                if (typeof method !== "string" && method != null) {  //alle um eine Position nach rechts schieben
                    login = handleError;
                    handleError = error;
                    error = success;
                    success = params;
                    params = method;
                    method = undefined;
                }

                if (typeof params !== "object" && params != null) {  //alle um eine Position nach rechts schieben
                    login = handleError;
                    handleError = error;
                    error = success;
                    success = params;
                    params = undefined;
                }

                if (typeof error !== "function" && error != null) {  //alle um eine Position nach rechts schieben
                    login = handleError;
                    handleError = error;
                    error = undefined;
                }

                var apiCall = function (accessToken) {
                    TFB.log("api Call", TFB.LogPriority.Low);
                    if (accessToken && params == null) {
                        params = {};
                    }

                    if (params != null && typeof params.access_token !== "string") {
                        params.access_token = accessToken;
                    }

                    try {
                        FB.api(path,
                            method,
                            params,
                            function (resp) {
                                if (!resp || resp.error) {
                                    if (handleError) {
                                        handleApiError(resp, path, method, params, success, error, login);
                                    }
                                    else {
                                        execCallback(resp, error, success);
                                    }

                                    TFB.trigger("apiError", [resp, currentAppId]);

                                    return;
                                }

                                TFB.trigger("apiSuccess", [resp, currentAppId]);

                                execUnsafeFunction(resp, success);
                            });
                    }
                    catch (exception) {
                        TFB.log(exception, TFB.LogPriority.High);
                    }
                };

                var loginWithScope = typeof login === "object" && !login.success && login.opts && (typeof login.opts.scope === "string");

                if (!login || loginWithScope && TFB.checkPermissions(login.opts.scope)) {
                    apiCall(Facebook.accessToken);
                }
                else {
                    TFB.getLoginStatus(function (status) {
                            TFB.log("login success", TFB.LogPriority.Low);
                            if (typeof login.success === "function") {
                                try {
                                    if (typeof login.success === "function" &&
                                        login.success(status) === false) // wenn der Callback false zurückgibt soll der apiCall abgebrochen werden
                                    {
                                        return;
                                    }
                                }
                                catch (exception) {
                                    TFB.log(exception, TFB.LogPriority.High);
                                }
                            }

                            var accessToken = null;
                            if (status && status.authResponse && status.authResponse.accessToken) {
                                accessToken = status.authResponse.accessToken;
                            }
                            else {
                                TFB.log("FB-Login Exception: (keinen accessToken gefunden)", TFB.LogPriority.High);
                                TFB.log(status, TFB.LogPriority.High);
                            }
                            apiCall(accessToken);
                        }, function (status) {
                            TFB.log("login error", TFB.LogPriority.Low);
                            if (typeof login.error === "function" || typeof login.success === "function") {
                                var callback = (typeof login.error === "function") ? login.error : login.success;
                                try {
                                    if (typeof callback === "function" &&
                                        callback(status) === false) // wenn der Callback false zurückgibt soll der apiCall abgebrochen werden
                                    {
                                        return;
                                    }
                                }
                                catch (exception) {
                                    TFB.log(exception, TFB.LogPriority.High);
                                }
                            }

                            TFB.log("FB-Login Exception: ", TFB.LogPriority.High);
                            TFB.log(status, TFB.LogPriority.High);
                            //bei Fehler trotzdem versuchen den apiCall auszuführen
                            apiCall();
                        },
                        login.opts,
                        login.allowLoginDialog);
                }
            },
            //----------------------------------------------
            //---Debugging Funktionen
            //----------------------------------------------
            log: function (msg, debugLvl /*optional*/) {
                if (tfbDebugLvl <= TFB.LogPriority.NoLogs) {
                    return;
                }

                if (debugLvl == null || typeof debugLvl !== "number") {
                    debugLvl = TFB.LogPriority.Normal;
                }

                if (debugLvl >= tfbDebugLvl && window.console) {
                    TFB.latestLog = msg;
                    window.console.log(msg);
                }
            },
            //----------------------------------------------
            //---TODO: Oft verwendete Funktionen
            //----------------------------------------------
            fbDateToDate: function (dateString) {
                //2011-05-06T08:38:13+0000
                var digitpattern = /\d+/g,
                    matches = dateString.match(digitpattern);

                y = matches[0] * 1;
                mo = matches[1] * 1;
                d = matches[2] * 1;
                h = matches[3] * 1;
                mi = matches[4] * 1;
                s = matches[5] * 1;
                ref = matches[6] * 1;
                if (!isNaN(ref))
                    h += ref;
                mo -= 1;

                var _date = new Date(y, mo, d, h, mi, s);
                _date.setHours(h - (_date.getTimezoneOffset() / 60 - ref));
                return _date;
            },
            formatFBDate: function (dateString) {
                heute = new Date();
                heuteUnix = heute / 1000;
                var dateObj = TFB.fbDateToDate(dateString);
                var diff = heuteUnix - dateObj / 1000;

                if (diff >= 3600 * 24)
                    return dateObj.getDate() + "." + (dateObj.getMonth() + 1) + "." + dateObj.getFullYear() + " um " + dateObj.getHours() + ":" + dateObj.getMinutes();
                else if (diff >= 7200)
                    return "vor " + Math.floor(diff / 3600) + " Stunden";
                else if (diff >= 3600)
                    return "vor etwa einer Stunde";
                else if (diff >= 120)
                    return "vor " + Math.floor(diff / 60) + " Minuten";
                else if (diff >= 60)
                    return "vor einer Minute";
                else
                    return "vor " + Math.floor(diff) + " Sekunden";
            },
            fbFormatLikeStr: function (likes, user_likes) {
                var postFix = " ";
                if (user_likes && likes == 1) {
                    return "Dir" + postFix;
                }
                else if (user_likes && likes == 2) {
                    return "Dir und einer weiteren Person" + postFix;
                }
                else if (user_likes) {
                    return "Dir und weiteren " + (likes - 1) + " Personen" + postFix;
                }
                else if (likes == 1) {
                    return "Einer Person" + postFix;
                }
                else {
                    return likes + " Personen" + postFix;
                }
            },
            getPermissions: function (callback /*optional*/, forceRequest) {
                if (typeof callback === "boolean" && forceRequest == null) {
                    forceRequest = callback;
                    callback = null;
                }

                if (!forceRequest && TFB.hasCachedPermissions()) {
                    execUnsafeFunction(fufProperties.Permissions, callback);
                    return;
                }

                TFB.api("v2.2/me/permissions", "GET", {access_token: getAccessToken()},function (resp) {
                    var params = null;
                    var p = {};
                    if (!resp.data) return;
                    for (var i = 0; i < resp.data.length; i++) {
                        if (resp.data[i].status == "granted")
                            p[resp.data[i].permission] = 1;
                        else if (resp.data[i].status == "declined")
                            p[resp.data[i].permission] = 0;
                    }
                    resp.data[0] = p;
                    if (resp && resp.data instanceof Array) {
                        params = resp.data[0];
                        fufProperties.Permissions = resp.data[0];
                    }

                    execUnsafeFunction(params, callback);
                });
            },
            getPermissonsSync: function () {
                return fufProperties.Permissions;
            },
            //überprüfen, ob die Permissions zur Verfügung stehen
            checkPermissions: function (permissions) {
                if (permissions == null) return true;
                if (!TFB.hasCachedPermissions()) return false;

                if (typeof permissions === "string") {
                    permissions = permissions.split(",");
                }

                _strArrTrim(permissions);

                for (var p in permissions) {
                    if (fufProperties.Permissions[permissions[p]] !== 1) return false;
                }

                return true;
            },
            checkPermissionDeclined: function (permission) {
                if (permission == null) return false;
                if (!TFB.hasCachedPermissions()) return false;

                if (typeof permission !== "string")
                    return false;

                return fufProperties.Permissions[permission] === 0;
            },
            hasCachedPermissions: function () {
                return typeof fufProperties.Permissions === "object";
            },
            //sollte nur nach einem onClick Event aufgerufen werden und wenn Permissions gecached wurden
            askForPermissions: function (/*Array oder String*/permissons, callback, rerequest) {
                var arrPermissons = permissons;
                if (permissons instanceof Array) {
                    permissons = permissons.toString();
                }
                else if (typeof permissons === "string") {
                    arrPermissons = permissons.split(",");
                }

                if (typeof permissons !== "string" || !(arrPermissons instanceof Array)) {
                    TFB.log("Argument 'permissions' must be an Array or a String");
                    return;
                }
                var opts = { scope: permissons };
                if (rerequest)
                    opts.auth_type = 'rerequest';
                TFB.getLoginStatus(function (resp) {
                    TFB.getPermissions(function (respPermissons) {
                        if (respPermissons) {
                            var successFlag = true;
                            for (var i = 0; i < arrPermissons.length; i++) {
                                arrPermissons[i] = $.trim(arrPermissons[i]);
                                if (respPermissons[arrPermissons[i]] != 1) {
                                    successFlag = false;
                                    break;
                                }
                            }

                            execUnsafeFunction(successFlag, callback);
                        }
                        else {
                            execUnsafeFunction(false, callback);
                        }
                    }, true);
                }, function (resp) {
                    execUnsafeFunction(false, callback);
                }, opts, true);
            },
            //muss synchron sein
            getIconUrl: function (picType) {
                var ret = null;

                var userId = 1;

                if (loginStatus && loginStatus.isConnected) {
                    userId = loginStatus.authResponse.userID;


                }

                ret = "//graph.facebook.com/" + userId + "/picture/";

                if (typeof picType === "string") {
                    ret += "?type=" + picType;
                }

                return ret;
            },
            //bei callback == null wird diese Funktion synchron ausgeführt
            getMe: function (callback /*optional*/) {
                if (typeof callback === "function" || callback === true) {
                    TFB.api("/me", function (resp) {

                        fufProperties.me = resp;
                        execUnsafeFunction(resp, callback);
                    }, function () {
                        execUnsafeFunction(callback);
                    });
                    return;
                }
                else if (fufProperties.me) {
                    return fufProperties.me;
                }

                return;
            },
            setCanvasSize: function(height) {
                FB.Canvas.setSize({ height: height });
            }
        };
    })();  