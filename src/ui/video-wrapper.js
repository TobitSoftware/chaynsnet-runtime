import htmlToElement from 'html-to-element';

let $videoWrapper;
let $checkTypePlayer;

export default class VideoWrapper {
    /**
     * creates an Video-Wrapper element on DOM with given video url
     * @param url
     */
    static show = (url) => {
        const videoType = getType(url);

        if (videoType) {
            VideoWrapper.hide();

            $videoWrapper = htmlToElement('<div class="video-wrapper"></div>');

            const $video = getVideo(url, videoType);
            $videoWrapper.appendChild($video);

            $videoWrapper.addEventListener('click', () => VideoWrapper.hide());
            $video.addEventListener('click', e => e.stopPropagation());

            document.body.appendChild($videoWrapper);
            return true;
        }
        return false;
    };

    /**
     * hides VideoWrapper
     */
    static hide = () => {
        if ($videoWrapper) {
            $videoWrapper.parentElement.removeChild($videoWrapper);
            $videoWrapper = null;
        }
    };
}

const getVideo = (url, type) => htmlToElement(`
<video controls autoplay>
    <source src="${url}" type="${type}"/>                                        
    Your browser does not support the video tag.
</video>`);

const getType = (url) => {
    const urlParts = url.split('.');
    const type = `video/${urlParts[urlParts.length - 1]}`;

    if (!$checkTypePlayer) {
        $checkTypePlayer = document.createElement('video');
    }

    if ($checkTypePlayer.canPlayType(type) !== '') {
        return type;
    }
    return null;
};
