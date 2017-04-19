export default function sendEventToTopFrame(req, res) {
    if (!req.value || !req.value.event) {
        return res.event(2, 'Field event missing.');
    }

    const event = new CustomEvent(req.value.event);
    event.data = req.value.object;
    window.dispatchEvent(event);
}
