import Image from '../../ui/image-wrapper';

export default function showPictures(req, res) {
    let { startIndex } = req.value;
    const { urls } = req.value;

    if ((urls || []).length === 0) return res.event(2, 'Field urls is missing.');

    if (startIndex > urls.length - 1) startIndex = urls.length - 1;

    if (startIndex < 0) startIndex = 0;

    Image.show(urls, startIndex, req.srcIframe[0]);

    return null;
}
