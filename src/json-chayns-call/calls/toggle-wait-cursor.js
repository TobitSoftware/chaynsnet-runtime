import WaitCursor from '../../ui/wait-cursor';

export default function toggleWaitCursor(req, res) {
    if (req.value.enabled) {
        WaitCursor.show(req.value.timeout, req.value.text, req.srcIframe[0]);
        return;
    }
    WaitCursor.hide(req.srcIframe[0]);
}
