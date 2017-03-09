import htmlToElement from 'html-to-element';
import {numberToTimeString} from '../../../utils/convert';
import {compareDate} from '../../../utils/helper';

export default class TimePicker {
    $timePicker = null;
    $hoursInput = null;
    $minutesInput = null;

    selectedDate = null;

    hoursDirection = {
        up: 0,
        down: 0
    };

    constructor(config) {
        this.minDate = (config.minDate) ? new Date(config.minDate) : null;
        this.maxDate = (config.maxDate) ? new Date(config.maxDate) : null;

        if (this.minDate && this.maxDate && this.minDate >= this.maxDate) {
            throw 'minDate could not be greater than maxDate!';
        }

        this.selectedTime = this.selectedDate = new Date(config.selectedDate || Date.now());

        if (this.minDate && compareDate(this.minDate, this.selectedDate)
            && (this.minDate.getHours() > this.selectedTime.getHours() || (this.minDate.getHours() === this.selectedTime.getHours() && this.minDate.getMinutes() > this.selectedTime.getMinutes()))) {
            this.selectedTime = this.minDate;
        } else if (this.maxDate && compareDate(this.minDate, this.selectedDate)
            && (this.maxDate.getHours() < this.selectedTime.getHours() || (this.maxDate.getHours() === this.selectedTime.getHours() && this.maxDate.getMinutes() < this.selectedTime.getMinutes()))) {
            this.selectedTime = this.maxDate;
        }
        this.element;
    }

    updateSelectedDate(date) {
        this.selectedDate = date;
        this.checkValues();
    }

    set hours(value) {
        if (!this.$hoursInput) {
            return;
        }
        this.$hoursInput.value = numberToTimeString(value);
    }

    get hours() {
        if (!this.$hoursInput) {
            return;
        }
        return parseInt(this.$hoursInput.value, 10)
    }

    set minutes(value) {
        if (!this.$minutesInput) {
            return;
        }
        this.$minutesInput.value = numberToTimeString(value);
    }

    get minutes() {
        if (!this.$minutesInput) {
            return;
        }
        return parseInt(this.$minutesInput.value, 10)
    }

    get element() {
        if (this.$timePicker) {
            return this.$timePicker;
        }

        this.$timePicker = htmlToElement(`
        <div class="time-picker no-select">
            <div class="table">
                <div class="table__row">
                    <div class="table__cell hours arrow up">
                        <i class="fa fa-angle-up"></i>
                    </div>
                    <div class="table__cell"></div>
                    <div class="table__cell minutes arrow up">
                        <i class="fa fa-angle-up"></i>
                    </div>
                </div>
                <div class="table__row">
                    <div class="table__cell table-width">
                        <div class="time-picker__hours">
                            <input id="picker__hours" type="${chayns.env.browser.name === 'firefox' ? 'tel' : 'number'}" pattern="[0-9]*" min ="0" max="23" value="${numberToTimeString(this.selectedTime.getHours())}" class="timepicker__hours">
                        </div>
                    </div>
                    <div class="table__cell" style="width: 10px !important;">
                        <div class="time-picker__separator">:</div>
                    </div>
                    <div class="table__cell table-width">
                        <div class="time-picker__minutes">
                            <input id="picker__minutes"  type="${chayns.env.browser.name === 'firefox' ? 'tel' : 'number'}" pattern="[0-9]*" min ="0" max="59" value="${numberToTimeString(this.selectedTime.getMinutes())}" class="timepicker__minutes">
                        </div>
                    </div>
                </div>
                <div class="table__row">
                    <div class="table__cell hours arrow down">
                        <i class="fa fa-angle-down "></i>
                    </div>
                    <div class="table__cell"></div>
                    <div class="table__cell minutes arrow down">
                        <i class="fa fa-angle-down "></i>
                    </div>
                </div>
            </div>
        </div>`);

        this.$hoursInput = this.$timePicker.querySelector('#picker__hours');
        this.$minutesInput = this.$timePicker.querySelector('#picker__minutes');

        this.$hoursInput.addEventListener('blur', () => {
            this.checkValues();
            if (this.hours < 10) {
                this.hours = this.hours;
            }
        });
        this.$minutesInput.addEventListener('blur', () => {
            this.checkValues();
            if (this.minutes < 10) {
                this.minutes = this.minutes;
            }
        });

        this.checkValues();

        //Minutes Up/Down Arrows
        this.$timePicker.querySelector('.hours.arrow.up').addEventListener('click', () => {
            this.hours++; //this.hours = this.hours + 1;
            this.hoursDirection.up++;
            this.hoursDirection.down = 0;
            this.checkValues();
        });
        this.$timePicker.querySelector('.hours.arrow.down').addEventListener('click', () => {
            this.hours--;
            this.hoursDirection.up = 0;
            this.hoursDirection.down++;
            this.checkValues();
        });

        //Minutes Up/Down Arrows
        this.$timePicker.querySelector('.minutes.arrow.up').addEventListener('click', () => {
            this.minutes++;

            this.hoursDirection = {
                up: 1,
                down: 1
            };

            this.checkValues();
        });
        this.$timePicker.querySelector('.minutes.arrow.down').addEventListener('click', () => {
            this.minutes--;

            this.hoursDirection = {
                up: 1,
                down: 1
            };

            this.checkValues();
        });


        let inputOnArrowKey = (event) => {
            if (event.keyCode === 38 || event.keyCode === 40) { // ArrowUp || ArrowDown
                this.checkValues();
                if (this.minutes < 10) {
                    this.minutes = this.minutes;
                }
                if (this.hours < 10) {
                    this.hours = this.hours;
                }
            }
        };
        this.$hoursInput.addEventListener('keyup', inputOnArrowKey);
        this.$minutesInput.addEventListener('keyup', inputOnArrowKey);

        return this.$timePicker;
    }

    checkValues() {
        if (isNaN(this.hours)) {
            this.hours = this.selectedTime.getHours();
        }
        if (isNaN(this.minutes)) {
            this.minutes = this.selectedTime.getMinutes();
        }

        if (this.hours > 23) {
            this.hours = 0;
        } else if (this.hours < 0) {
            this.hours = 23;
        } else if (this.minutes > 59) {
            this.minutes = 0;
        } else if (this.minutes < 0) {
            this.minutes = 59;
        }

        if (this.maxDate && this.hours >= this.maxDate.getHours() && (!this.selectedDate || compareDate(this.selectedDate, this.maxDate))) {
            this.hours = this.maxDate.getHours();

            if (this.minutes > this.maxDate.getMinutes() || this.hoursDirection.up >= 2) {
                this.minutes = this.maxDate.getMinutes();
            }
        } else {
            this.hoursDirection.up = 0;
        }

        if (this.minDate && this.hours <= this.minDate.getHours() && (!this.selectedDate || compareDate(this.selectedDate, this.minDate))) {
            this.hours = this.minDate.getHours();

            if (this.minutes < this.minDate.getMinutes() || this.hoursDirection.down >= 2) {
                this.minutes = this.minDate.getMinutes();
            }
        } else {
            this.hoursDirection.down = 0;
        }
    };
}
