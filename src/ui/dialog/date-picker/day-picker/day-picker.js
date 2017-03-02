import classNames from 'classnames';
import {htmlToElement, numberToDayName, numberToMonthName} from '../../../../utils/convert';
import {_} from '../../../../utils/helper';

export default class DayPicker {

    $dayPicker = null;

    constructor(config, daySelectedCallback, monthOnClick) {
        this.minDate = (config.minDate) ? new Date(config.minDate) : null;
        this.maxDate = (config.maxDate) ? new Date(config.maxDate) : null;

        if (this.minDate && this.maxDate && this.minDate > this.maxDate) {
            throw 'minDate could not be greater than maxDate!';
        }

        this.selectedDate = new Date(config.selectedDate || Date.now());
        if (!this.isDateAllowed(this.selectedDate)) {
            this.selectedDate = (this.minDate) ? this.minDate : this.maxDate;
        }


        this.selectedMonth = this.selectedDate.getMonth();
        this.selectedYear = this.selectedDate.getFullYear();
        this.callback = daySelectedCallback;
        this.monthOnClick = monthOnClick;
        this.element;
    }

    get element() {
        if (this.$dayPicker) {
            return this.$dayPicker;
        }

        this.$dayPicker = htmlToElement(`<div class="day-picker no-select">
                                            <div class="day-picker__month-select">
                                                <span class="month-select__previous fa fa-angle-left ChaynsCS-Color"></span>
                                                <span class="month-select__next fa fa-angle-right ChaynsCS-Color"></span>                
                                            </div>
                                         </div>`);

        this.arrowNext = _('.month-select__next', this.$dayPicker);
        this.arrowPrevious = _('.month-select__previous', this.$dayPicker);


        this.arrowPrevious.addEventListener('click', () => {
            this.showMonth((this.selectedMonth <= 0) ? this.selectedYear - 1 : this.selectedYear, (this.selectedMonth <= 0) ? 11 : this.selectedMonth - 1);
            this.updateArrows();
        });
        this.arrowNext.addEventListener('click', () => {
            this.showMonth((this.selectedMonth >= 11) ? this.selectedYear + 1 : this.selectedYear, (this.selectedMonth >= 11) ? 0 : this.selectedMonth + 1);
            this.updateArrows();
        });
        this.updateArrows();

        this.showMonth(this.selectedYear, this.selectedMonth);

        return this.$dayPicker;
    }

    set selected(date) {
        if (typeof date === 'number') {
            date = new Date(date);
        }

        if (this.isDateAllowed(date)) {
            this.selectedDate = date;
            this.callback(date);
            this.showMonth();
        }
    }

    updateArrows() {
        if (!this.isDateAllowed(new Date((this.selectedMonth <= 0) ? this.selectedYear - 1 : this.selectedYear, (this.selectedMonth <= 0) ? 12 : this.selectedMonth, 0))) {
            this.arrowPrevious.classList.add('hidden');
        } else {
            this.arrowPrevious.classList.remove('hidden');
        }
        if (!this.isDateAllowed(new Date((this.selectedMonth >= 11) ? this.selectedYear + 1 : this.selectedYear, (this.selectedMonth >= 11) ? 0 : this.selectedMonth + 1))) {
            this.arrowNext.classList.add('hidden');
        } else {
            this.arrowNext.classList.remove('hidden');
        }
    }

    showMonth(year, month) {
        if ((this.minDate && (this.minDate.getFullYear() > year || (this.minDate.getFullYear() === year && this.minDate.getMonth() > month))) || (this.maxDate && (this.maxDate.getFullYear() < year || (this.maxDate.getFullYear() === year && this.maxDate.getMonth() < month)))) {
            return false;
        }

        if (year !== undefined && month !== undefined) {
            if ((year && typeof year === 'number') && (typeof month === 'number' && month <= 11 && month >= 0)) {
                this.selectedYear = year;
                this.selectedMonth = month;
            } else {
                return false;
            }
        }

        if (this.$dayTable) {
            this.$dayPicker.removeChild(this.$dayTable);
        }

        this.$dayTable = this.getDayTable(this.selectedYear, this.selectedMonth);
        this.$dayPicker.appendChild(this.$dayTable);
        this.updateArrows();
    }

    isDateAllowed(date) {
        let year = date.getFullYear();
        let month = date.getMonth();
        let day = date.getDate();

        if (this.minDate) {
            if (year < this.minDate.getFullYear()) {
                return false;
            } else if (year === this.minDate.getFullYear() && month < this.minDate.getMonth()) {
                return false
            } else if (year === this.minDate.getFullYear() && month === this.minDate.getMonth() && day < this.minDate.getDate()) {
                return false
            }
        }

        if (this.maxDate) {
            if (this.maxDate && year > this.maxDate.getFullYear()) {
                return false;
            } else if (year === this.maxDate.getFullYear() && month > this.maxDate.getMonth()) {
                return false;
            } else if (year === this.maxDate.getFullYear() && month === this.maxDate.getMonth() && day > this.maxDate.getDate()) {
                return false;
            }
        }

        return true;
    }

    getDayTable(year, month) {
        let date = new Date(0);
        date.setFullYear(year);
        date.setMonth(month);
        date.setDate(1);

        let $element = htmlToElement(`<div class="day-picker__day-table">
                                        <div class="day-table__month">
                                            <span>${numberToMonthName(month)} ${year}</span>
                                        </div>
                                    </div>`);
        _('.day-table__month span', $element).addEventListener('click', () => this.monthOnClick(year));
        //DayNames
        if (!this.$weekDays) {
            this.$weekDays = htmlToElement(`<div class="day-table__week-days"></div>`);

            for (let i = 1; i < 7; i++) {
                this.$weekDays.appendChild(htmlToElement(`<div class="ChaynsCS-Color">${numberToDayName(i, 2)}</div>`));
            }

            this.$weekDays.appendChild(htmlToElement(`<div class="ChaynsCS-Color">${numberToDayName(0, 2)}</div>`));
        }
        $element.appendChild(this.$weekDays);

        //Date to last Monday
        while (date.getDay() !== 1) {
            date.setDate(date.getDate() - 1);
        }

        //build table
        for (let week = 0, l = 6; week < l; week++) {
            let $month = htmlToElement('<div class="day-table__week-row"></div>');

            for (let day = 0, k = 7; day < k; day++) {
                let classes = classNames({
                    'day--out-of-month': date.getMonth() !== month,
                    'day--blocked': date.getMonth() === month && !this.isDateAllowed(date),
                    'day--selected ChaynsCS-Color': this.selectedDate.getDate() === date.getDate() && this.selectedDate.getMonth() === date.getMonth() && this.selectedDate.getFullYear() === date.getFullYear()
                });

                let $day = htmlToElement(`<div class="${classes}" data-date="${date.getTime()}">${date.getDate()}</div>`);

                $day.addEventListener('click', (event) => {
                    let selectedDate = new Date(parseInt((event.toElement || event.srcElement || event.target).getAttribute('data-date'), 10));
                    if (selectedDate.getMonth() === month && selectedDate.getFullYear() === year) {
                        this.selected = selectedDate;
                    } else {
                        this.showMonth(selectedDate.getFullYear(), selectedDate.getMonth());
                    }
                });

                $month.appendChild($day);

                date.setDate(date.getDate() + 1);
            }
            $element.appendChild($month);
        }

        return $element;
    }
}