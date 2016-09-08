/**
 * Function that do the same as query's "$(el).outerHeight(true)"
 * @param el
 * @returns {number}
 */
export function outerHeight(el) {
    let height = el.offsetHeight;
    let style = getComputedStyle(el);

    height += parseInt(style.marginTop) + parseInt(style.marginBottom);
    return height;
}

/**
 * Convert Object to CSS Style String.
 *
 *   Example:
 *      {
 *          height: "20px",
 *          width: {
 *              "20px": false,
 *              "30px": true,
 *              "40px": true
 *          }
 *      }
 *      returns: ' "height:20px;width:30px;" '
 *
 * @param styles
 * @returns {string}
 */
export function styleNames(styles) {
    let styleNames = '';

    for (let key of Object.keys(styles)) {
        if (typeof styles[key] === "string") {
            styleNames += `${key}:${styles[key]};`;
            continue;
        }

        if (typeof styles[key] !== "object" || styles[key].length === 0) {
            continue;
        }

        let conditions = styles[key];

        for (let value of Object.keys(conditions)) {
            if (conditions[value]) {
                styleNames += `${key}:${value};`;
                break;
            }
        }
    }

    return `"${styleNames}"`;
}