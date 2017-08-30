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
        ImageWrapper.hide();

        currentIndex = startIndex;

        $imageShadow = htmlToElement('<div class="image-shadow image-shadow--full-display"></div>');
        $imageWrapper = htmlToElement('<div class="image-wrapper image-wrapper--full-display"></div>');

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
        if ($imageWrapper) document.body.removeChild($imageWrapper);
        if ($imageShadow) document.body.removeChild($imageShadow);

        if (document.body) document.body.removeEventListener('keydown', handleKeyDown);
        if ($imageWrapper) $imageWrapper.removeEventListener('click', handleClick);

        imageList = [];
    };

    /**
     * navigates to next image
     */
    static next = () => {
        const newIndex = getNextIndex();

        document.querySelector(`#imageContainer_${currentIndex}`).classList.add('image-wrapper__image-container--hide');

        currentIndex = newIndex;

        $imageWrapper.removeChild($imageWrapper.firstChild);

        const nextImg = getImage(getNextIndex(), false);

        if (nextImg) $imageWrapper.appendChild(nextImg);

        document.querySelector(`#imageContainer_${currentIndex}`).classList.remove('image-wrapper__image-container--hide');
    };

    /**
     * navigates to previous image
     */
    static prev = () => {
        const newIndex = getPreviousIndex();

        document.querySelector(`#imageContainer_${currentIndex}`).classList.add('image-wrapper__image-container--hide');

        currentIndex = newIndex;

        $imageWrapper.removeChild($imageWrapper.lastChild);

        const nextImg = getImage(getPreviousIndex(), false);

        if (nextImg) $imageWrapper.insertBefore(nextImg, $imageWrapper.firstChild);

        document.querySelector(`#imageContainer_${currentIndex}`).classList.remove('image-wrapper__image-container--hide');
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

    if (targetClassList.contains('image-wrapper__image-container__nav-button') || targetClassList.contains('image-wrapper__image-container__nav-button__icon')) {
        if (targetClassList.contains('image-wrapper__image-container__nav-button--next') || targetClassList.contains('image-wrapper__image-container__nav-button__icon--next')) {
            ImageWrapper.next();
        } else {
            ImageWrapper.prev();
        }
    } else if (!targetClassList.contains('image-wrapper__image-container__image')) {
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
    const containerClasses = classNames('image-wrapper__image-container', {
        'image-wrapper__image-container--hide': !show
    });

    const navigationPrevClasses = classNames('image-wrapper__image-container__nav-button image-wrapper__image-container__nav-button--prev', {
        'image-wrapper__image-container__nav-button--hide': imageList.length < 2
    });

    const navigationNextClasses = classNames('image-wrapper__image-container__nav-button image-wrapper__image-container__nav-button--next', {
        'image-wrapper__image-container__nav-button--hide': imageList.length < 2
    });

    const image = imageList[index];

    return htmlToElement(`<div id="imageContainer_${index}" class="${containerClasses}">
        <div id="NavPrev_${index}" class="${navigationPrevClasses}">
            <i class="fa fa-chevron-left image-wrapper__image-container__nav-button__icon image-wrapper__image-container__nav-button__icon--prev"></i>
        </div>
        <img src="${image.url}" class="image-wrapper__image-container__image">
        <div id="NavNext_${index}" class="${navigationNextClasses}">
            <i class="fa fa-chevron-right image-wrapper__image-container__nav-button__icon image-wrapper__image-container__nav-button__icon--next"></i>
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
