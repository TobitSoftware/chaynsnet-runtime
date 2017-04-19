import { getWindowMetrics } from '../../utils/helper';

export default function setIframeHeigth(req, res) {
    const $iframe = req.srcIframe[0];
    const value = req.value;

    if (!value.full && !('height' in value) && !('fullViewport' in value)) {
        res.event(2, 'Field height missing.');
        return;
    } else if (value.full || value.fullViewport) {
        value.height = getWindowMetrics().AvailHeight;
        document.body.classList.add('no-scroll');
    } else {
        value.height = parseInt(value.height, 10);
        document.body.classList.remove('no-scroll');
    }

    if (isNaN(value.height)) {
        req.event(1, 'Field heigth is not typeof number');
        return;
    }

    value.growOnly = value.growOnly !== false; // true als default

    if ($iframe && (!value.growOnly || parseInt($iframe.style.height) < value.height)) {
        $iframe.style.height = `${value.height}px`;
    }
}
