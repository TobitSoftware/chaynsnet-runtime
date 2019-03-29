export default function sendEventToTopFrame(req, res) {
    if (!req.value || !req.value.event) {
        res.event(2, 'Field event missing.');
        return;
    }

    const event = new CustomEvent(req.value.event);
    event.data = req.value.object;
    window.dispatchEvent(event);
}
