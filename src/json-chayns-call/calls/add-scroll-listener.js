import throttle from 'lodash.throttle';
import { getWindowMetrics } from '../../utils/helper';

export default function addScrollListener(req, res) {
    const scrollListener = event => res.answer({
        event: {
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
        windowMetrics: getWindowMetrics()
    });

    window.addEventListener('scroll', throttle(scrollListener, parseInt(req.value.throttle, 10) || 200));
}
