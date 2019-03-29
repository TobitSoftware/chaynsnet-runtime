/* eslint-disable no-unused-vars */
import FloatingButton from '../../ui/floating-button';
import loadTapp from '../../tapp/custom-tapp';

export default function selectTab(req, res) {
    FloatingButton.hide(req.srcIframe[0]);

    loadTapp(req.value.id);
}
