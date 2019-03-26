import VideoWrapper from '../../ui/video-wrapper';

export default function showPictures(req, res) {
    const { url } = req.value;

    if (!url) {
        res.event(2, 'Field url is missing.');
        return;
    }

    if (!VideoWrapper.show(url)) {
        res.event(2, 'Unsupported video type.');
    }
}
