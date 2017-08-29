import htmlToElement from 'html-to-element';
import classNames from 'classnames';

let $imageShadow;
let $imageWrapper;
let imageList = [];
let currentIndex = 0;

export default class ImageWrapper {
    /**
     * creates an ImageWrapper and ImageShadow element on DOM with given images
     * @param {array} urls
     * @param {int} startIndex
     */
    static show = (urls, startIndex) => {
        // TODO: Error message to user
        if ((urls || []).length === 0) return;

        currentIndex = startIndex;

        $imageShadow = htmlToElement('<div id="ImageShadow" class="full-display"></div>');
        $imageWrapper = htmlToElement('<div id="ImageWrapper" class="full-display"></div>');

        document.body.appendChild($imageShadow);
        document.body.appendChild($imageWrapper);

        urls.forEach((url) => {
            imageList.push({
                url
            });
        });

        const prevImg = imageList.length > 2 ? getImage(getPreviousIndex(), false) : null;
        const nextImg = imageList.length > 1 ? getImage(getNextIndex(), false) : null;
        const curImg = getImage(currentIndex, true);

        if (prevImg) $imageWrapper.appendChild(prevImg);
        $imageWrapper.appendChild(curImg);
        if (nextImg) $imageWrapper.appendChild(nextImg);

        document.body.addEventListener('keydown', handleKeyDown);
        $imageWrapper.addEventListener('click', handleClick);
    };

    /**
     * hides ImageWrapper
     */
    static hide = () => {
        document.body.removeChild($imageWrapper);
        document.body.removeChild($imageShadow);

        document.body.removeEventListener('keydown', handleKeyDown);
        $imageWrapper.removeEventListener('click', handleClick);

        imageList = [];
    };

    static next = () => {
        console.debug('NEXT:');
    };

    static prev = () => {
        console.debug('PREV:');
    };
}

/**
 * handles key down events and their actions
 * @param event
 */
function handleKeyDown(event) {
    if (event.keyCode === 27) {
        ImageWrapper.hide();
    }
}

/**
 * handles click events and their actions
 * @param event
 */
function handleClick(event) {
    console.debug('ONCLICK:', event);
}

function showNext(event) {
    event.preventDefault();

    ImageWrapper.next();
}

function showPrev(event) {
    event.preventDefault();

    ImageWrapper.prev();
}

/**
 * returns a Image node
 * @param {int} index
 * @param {boolean} show
 * @returns {*}
 */
function getImage(index, show) {
    const containerClasses = classNames('image-container', {
        hidden: !show
    });

    const image = imageList[index];

    return htmlToElement(`<div class="${containerClasses}">
        <div class="nav-button prev" onclick="showPrev()">
            <i class="fa fa-chevron-left"></i>
        </div>
        <img src="${image.url}">
        <div class="nav-button next" onclick="showNext()">
            <i class="fa fa-chevron-right"></i>
        </div>
    </div>`);
}

/**
 * gives previous index
 */
function getPreviousIndex() {
    let index = currentIndex - 1;

    const imageCount = imageList.length;

    if (index < 0) index += imageCount;

    return index;
}

/**
 * gives next index
 */
function getNextIndex() {
    let index = currentIndex + 1;

    const imageCount = imageList.length;

    if (index > imageCount - 1) index -= imageCount;

    return index;
}
