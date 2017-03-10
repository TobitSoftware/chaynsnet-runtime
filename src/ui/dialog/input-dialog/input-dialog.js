import htmlToElement from 'html-to-element';

export default class InputDialog {

    $input = null;
    placeholder = null;

    constructor(config) {
        this.placeholder = (config.placeholderText != null) ? config.placeholderText : 'Schreibe etwas...';
    }

    get element() {
        if (this.$input) {
            return this.$input;
        }

        this.$input = htmlToElement(`<textarea class="input input-dialog"
                                                 autogrow
                                                 placeholder="${this.placeholder}"
                                        ></textarea>`);
        return this.$input;
    }

    get value() {
        return this.$input.value;
    }
}