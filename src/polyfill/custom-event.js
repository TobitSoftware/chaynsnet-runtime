try {
    new window.CustomEvent('test');
} catch (e) {
    const CustomEvent = function (event, params) {
        let evt;

        params = params || {
                bubbles: false,
                cancelable: false,
                detail: undefined
            };

        evt = document.createEvent('CustomEvent');
        evt.initCustomEvent(event, params.bubbles, params.cancelable, params.detail);

        return evt;
    };

    CustomEvent.prototype = window.Event.prototype;
    window.CustomEvent = CustomEvent;
}
