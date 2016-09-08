window.CustomTappCommunication = window.CustomTappCommunication || {};

(function (module) {
    function onWindowMessage(e) {
        e = e.originalEvent ? e.originalEvent : e;

        let chaynsNamespace = /^((chayns.\w*.)(\w*))@?(\w*)?:(\{?.*}?)/;

        // 0-1: string, 2: namespace, 3: method, 4: sourceIFrame, 5: Params
        let result = chaynsNamespace.exec(e ? e.data : '');
        if (result) {
            if (result[3]) {
                let fn = module.Functions[result[3].toLowerCase()];
                if (typeof fn == 'function') {
                    fn(result[5], [
                        result[4] ? document.querySelector(`#${result[4]}`) : null,
                        result[2]
                    ]);
                }
            }
        }
    }

    module.Init = () => window.addEventListener("message", onWindowMessage, false);

    module.PostMessage = (method, params, source) => {
        let win = null;
        let $customTappIframe = document.querySelector('#CustomTappIframe');
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
                // Logging
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

    module.jsoncall = module.chaynscall;

})(window.CustomTappCommunication.Functions = {}, window.CustomTappCommunication);
