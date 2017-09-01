import ImageWrapper from '../../ui/image-wrapper';

export default function showPictures(req, res) {
    const { urls } = req.value;

    if ((urls || []).length === 0) {
        return res.event(2, 'Field urls is missing.');
    }

    let { startIndex } = req.value;

    if (startIndex) {
        if (startIndex < 0) {
            startIndex = 0;
        } else if (startIndex > urls.length - 1) {
            startIndex = urls.length - 1;
        }
    } else {
        startIndex = 0;
    }

    ImageWrapper.show(urls, startIndex);

    return null;
}
