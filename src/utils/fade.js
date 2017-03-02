let transitionDuration = null;

export default class Fade {
    //noinspection ReservedWordAsName
    /**
     * Fades element in.
     * @param element
     * @param transition
     * @returns {Promise}
     */
    static in(element, transition) {
        return new Promise((resolve) => {
            if (element && element.classList) {
                if (!transition) {
                    element.classList.add('transition--fade');
                } else {
                    element.style.transition = transition;
                }

                element.classList.remove('fade-out');

                if (!transitionDuration)
                    getTransitionDuration(element);

                setTimeout(() => {
                    element.classList.remove('transition--fade');
                    //element.removeAttribute('style');
                    resolve();
                }, transitionDuration);
            }
        })
    }

    /**
     * Fades element out.
     * @param element
     * @param transition
     * @returns {Promise}
     */
    static out(element, transition) {
        return new Promise((resolve) => {
            if (element && element.classList) {
                if (!transition) {
                    element.classList.add('transition--fade', 'fade-out');
                } else {
                    element.classList.add('fade-out');
                    element.style.transition = transition;
                }

                if (!transitionDuration)
                    getTransitionDuration(element);

                setTimeout(() => {
                    element.classList.remove('transition--fade');
                    element.removeAttribute('style');
                    resolve();
                }, transitionDuration);
            }
        })
    }
}

/**
 * Set transitionDuration to transitionDuration of that element
 * @param element
 */
function getTransitionDuration(element) {
    transitionDuration = window.getComputedStyle(element, null).transitionDuration;
    transitionDuration = transitionDuration.indexOf('ms') === -1 ? parseFloat(transitionDuration) * 1000 : parseFloat(transitionDuration);
}