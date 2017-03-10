import htmlToElement from 'html-to-element';
import {dateToString} from '../../../utils/convert';
import {_} from '../../../utils/helper';

import DayPicker from './day-picker/day-picker';
import MonthPicker from './month-picker/month-picker';


export default class DatePicker {

    $datePicker = null;

    $header = null;
    $headerYear = null;
    $headerDate = null;

    dayPicker = null;
    monthPicker = null;

    constructor(config, selectionChangedCb) {
        this.config = config;
        this.selectedDate = new Date(config.selectedDate || Date.now());
        this.minDate = (config.minDate) ? new Date(config.minDate) : null;
        this.maxDate = (config.maxDate) ? new Date(config.maxDate) : null;
        this.callback = selectionChangedCb;
        this.element;
    }

    get element() {
        if (this.$datePicker) {
            return this.$datePicker;
        }

        this.$datePicker = htmlToElement(`<div>
                <div class="date-picker__header ChaynsCS-BgColor">
                    <div class="date-picker__header__year"></div>
                    <div class="date-picker__header__date"></div>
                </div>
            </div>`);

        this.$headerYear = _('.date-picker__header__year', this.$datePicker);
        this.$headerDate = _('.date-picker__header__date', this.$datePicker);

        this.updateHeader();

        this.dayPicker = new DayPicker(this.config, (date) => {
            this.selectedDate = date;
            if (this.callback) {
                this.callback(date);
            }
            this.updateHeader();
        }, (year) => { //MonthSelectionCB
            this.monthPicker.selectedDate = this.selectedDate;
            this.monthPicker.showYear(year);

            this.$datePicker.removeChild(this.dayPicker.element);
            this.$datePicker.appendChild(this.monthPicker.element);
        });
        this.$datePicker.appendChild(this.dayPicker.element);

        this.monthPicker = new MonthPicker(this.config, (date) => {
            this.dayPicker.showMonth(date.getFullYear(), date.getMonth());

            this.$datePicker.removeChild(this.monthPicker.element);
            this.$datePicker.appendChild(this.dayPicker.element);
        });
        return this.$datePicker;
    }

    updateHeader() {
        this.$headerYear.innerHTML = this.selectedDate.getFullYear();
        this.$headerDate.innerHTML = dateToString(this.selectedDate);
    }
}