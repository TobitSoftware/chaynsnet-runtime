import {numberToTimeString, htmlToElement} from '../utils/convert';

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
        this.selectedDate = new Date(config.selectedDate || Date.now());
        this.minDate = (config.minDate) ? new Date(config.minDate) : null;
        this.maxDate = (config.maxDate) ? new Date(config.maxDate) : null;
    }

    updateSelectedDate(date) {
        this.selectedDate = date;
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
        <div id="timePicker" class="no-select">
            <div class="table" style="margin: 0 auto;">
                <div class="table__row">
                    <div class="table__cell hours">
                        <i class="fa fa-angle-up arrow up"></i>
                    </div>
                    <div class="table__cell"></div>
                    <div class="table__cell minutes">
                        <i class="fa fa-angle-up arrow up"></i>
                    </div>
                </div>
                <div class="table__row">
                    <div class="table__cell table-width">
                        <div class="timepicker__hours"><input type="text" id="picker__hours" value="${numberToTimeString(this.selectedDate.getHours())}" class="timepicker__hours"></div>
                    </div>
                    <div class="table__cell" style="width: 10px !important;">
                        <div class="timepicker__seperator">:</div>
                    </div>
                    <div class="table__cell table-width">
                        <div class="timepicker__minutes"><input type="text" id="picker__minutes" value="${numberToTimeString(this.selectedDate.getMinutes())}" class="timepicker__minutes"></div>
                    </div>
                </div>
                <div class="table__row">
                    <div class="table__cell hours">
                        <i class="fa fa-angle-down arrow down"></i>
                    </div>
                    <div class="table__cell"></div>
                    <div class="table__cell minutes">
                        <i class="fa fa-angle-down arrow down"></i>
                    </div>
                </div>
            </div>
            <input id="dlgDate" type="datetime">
        </div>`);

        this.$hoursInput = this.$timePicker.querySelector('#picker__hours');
        this.$minutesInput = this.$timePicker.querySelector('#picker__minutes');

        this.$timePicker.querySelector('.timepicker__hours').addEventListener('focusout', this.checkValues);
        this.$timePicker.querySelector('.timepicker__minutes').addEventListener('focusout', this.checkValues);

        this.checkValues();

        //Minutes Up/Down Arrows
        this.$timePicker.querySelector('.hours .arrow.up').addEventListener('click', () => {
            this.hours++; //this.hours = this.hours + 1;
            this.hoursDirection.up++;
            this.hoursDirection.down = 0;
            this.checkValues();
        });
        this.$timePicker.querySelector('.hours .arrow.down').addEventListener('click', () => {
            this.hours--;
            this.hoursDirection.up = 0;
            this.hoursDirection.down++;
            this.checkValues();
        });

        //Minutes Up/Down Arrows
        this.$timePicker.querySelector('.minutes .arrow.up').addEventListener('click', () => {
            this.minutes++;

            this.hoursDirection = {
                up: 1,
                down: 1
            };

            this.checkValues();
        });
        this.$timePicker.querySelector('.minutes .arrow.down').addEventListener('click', () => {
            this.minutes--;

            this.hoursDirection = {
                up: 1,
                down: 1
            };

            this.checkValues();
        });
        return this.$timePicker;
    }

    checkValues() {
        if (isNaN(this.hours)) {
            this.hours = this.selectedDate.getHours();
        }
        if (isNaN(this.minutes)) {
            this.minutes = this.selectedDate.getMinutes();
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

        if (this.maxDate && this.hours >= this.maxDate.getHours()) {
            this.hours = this.maxDate.getHours();

            if (this.minutes > this.maxDate.getMinutes() || this.hoursDirection.up >= 2) {
                this.minutes = this.maxDate.getMinutes();
            }
        } else {
            this.hoursDirection.up = 0;
        }

        if (this.minDate && this.hours <= this.minDate.getHours()) {
            this.hours = this.minDate.getHours();

            if (this.minutes < this.minDate.getMinutes() || this.hoursDirection.down >= 2) {
                this.minutes = this.minDate.getMinutes();
            }
        } else {
            this.hoursDirection.down = 0;
        }
    };
}
