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

    /**
     * navigates to next image
     */
    static next = () => {
        const newIndex = getNextIndex();

        document.querySelector(`#imageContainer_${currentIndex}`).classList.add('hide');

        currentIndex = newIndex;

        $imageWrapper.removeChild($imageWrapper.firstChild);

        const nextImg = getImage(getNextIndex(), false);

        if (nextImg) $imageWrapper.appendChild(nextImg);

        document.querySelector(`#imageContainer_${currentIndex}`).classList.remove('hide');
    };

    /**
     * navigates to previous image
     */
    static prev = () => {
        const newIndex = getPreviousIndex();

        document.querySelector(`#imageContainer_${currentIndex}`).classList.add('hide');

        currentIndex = newIndex;

        $imageWrapper.removeChild($imageWrapper.lastChild);

        const nextImg = getImage(getPreviousIndex(), false);

        if (nextImg) $imageWrapper.insertBefore(nextImg, $imageWrapper.firstChild);

        document.querySelector(`#imageContainer_${currentIndex}`).classList.remove('hide');
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

    if (event.keyCode === 37) {
        ImageWrapper.prev();
    }

    if (event.keyCode === 39) {
        ImageWrapper.next();
    }
}

/**
 * handles click events and their actions
 * @param event
 */
function handleClick(event) {
    const targetClassList = event.target.classList;

    if (targetClassList.contains('image-navigation')) {
        if (targetClassList.contains('next')) {
            ImageWrapper.next();
        } else {
            ImageWrapper.prev();
        }
    } else if (!targetClassList.contains('image')) {
        ImageWrapper.hide();
    }
}

/**
 * returns a Image node
 * @param {int} index
 * @param {boolean} show
 * @returns {*}
 */
function getImage(index, show) {
    const containerClasses = classNames('image-container', {
        hide: !show
    });

    const navigationPrevClasses = classNames('nav-button prev image-navigation', {
        hide: imageList.length < 2
    });

    const navigationNextClasses = classNames('nav-button next image-navigation', {
        hide: imageList.length < 2
    });

    const image = imageList[index];

    return htmlToElement(`<div id="imageContainer_${index}" class="${containerClasses}">
        <div id="NavPrev_${index}" class="${navigationPrevClasses}">
            <i class="fa fa-chevron-left image-navigation prev"></i>
        </div>
        <img src="${image.url}" class="image">
        <div id="NavNext_${index}" class="${navigationNextClasses}">
            <i class="fa fa-chevron-right image-navigation next"></i>
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
