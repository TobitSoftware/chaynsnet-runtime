const FADE_MODE = {
    IN: 1,
    OUT: 2
};

let defaultTransitionDuration = null;

export default class Fade {
    /**
     * Fades element in.
     * @param element
     * @param transition
     * @returns {Promise}
     */
    static in(element, transition) {
        return fade({
            fadeMode: FADE_MODE.IN,
            element,
            transition
        });
    }

    /**
     * Fades element out.
     * @param element
     * @param transition
     * @returns {Promise}
     */
    static out(element, transition) {
        return fade({
            fadeMode: FADE_MODE.OUT,
            element,
            transition
        });
    }
}

function fade({ fadeMode, element, transition }) {
    return new Promise((resolve) => {
        if (element && element.classList) {
            let transitionDuration = null;

            if (transition) {
                element.style.transition = transition;
                transitionDuration = getTransitionDuration(element);
            } else {
                element.classList.add('transition--fade');
                if (defaultTransitionDuration) {
                    transitionDuration = defaultTransitionDuration;
                } else {
                    transitionDuration = defaultTransitionDuration = getTransitionDuration(element);
                }
            }

            if (fadeMode === FADE_MODE.IN) {
                element.classList.remove('fade-out');
            } else if (fadeMode === FADE_MODE.OUT) {
                element.classList.add('fade-out');
            }

            setTimeout(() => {
                element.classList.remove('transition--fade');
                element.style.transition = '';
                resolve();
            }, transitionDuration);
        }
    });
}

/**
 * Returns transitionDuration to transitionDuration of that element
 * @param element
 * @return number
 */
function getTransitionDuration(element) {
    const elementTransitionDuration = window.getComputedStyle(element, null).transitionDuration;
    return elementTransitionDuration.indexOf('ms') === -1 ? parseFloat(elementTransitionDuration) * 1000 : parseFloat(elementTransitionDuration);
}