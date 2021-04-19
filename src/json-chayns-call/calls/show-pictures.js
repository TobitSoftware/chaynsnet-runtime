import ImageWrapper from '../../ui/image-wrapper';
import getDavidVersion from '../../utils/getDavidVersion';
import showPicture from '../../json-native-calls/calls/show-picture';

export default function showPictures(req, res) {
    const { urls } = req.value;
    console.log('showPicture', req, res, getDavidVersion());

    if ((urls || []).length === 0) {
        return res.event(2, 'Field urls is missing.');
    }

    if (getDavidVersion()) {
        showPicture(urls[0]).then((retVal) => {
            res.answer(retVal);
        });
        return;
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
