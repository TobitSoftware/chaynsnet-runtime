// @flow
import { _ } from '../../../../utils/helper';
import { htmlToElement } from '../../../../utils/convert';

export default class MonthPicker {

    $monthPicker: Object;
    $captionYear: Object;
    $yearTable: Object;
    $months: Object[] = [];
    $arrowPrevious: Object;
    $arrowNext: Object;

    selectedDate: Date;
    selectedYear: number;
    minDate: ?Date;
    maxDate: ?Date;
    callback: void;

    constructor(config: Object, monthSelectedCallback: void) {
        this.minDate = (config.minDate) ? new Date(config.minDate) : null;
        this.maxDate = (config.maxDate) ? new Date(config.maxDate) : null;

        if (this.minDate && this.maxDate && this.minDate > this.maxDate) {
            throw 'minDate could not be greater than maxDate!';
        }

        this.selectedDate = new Date(config.selectedDate || Date.now());
        if (!this.isDateAllowed(this.selectedDate)) {
            // $FlowIgnore
            this.selectedDate = (this.minDate) ? this.minDate : this.maxDate;
        }

        this.selectedYear = this.selectedDate.getFullYear();
        this.callback = monthSelectedCallback;
        this.element;
    }

    get element(): Object {
        if (this.$monthPicker) {
            return this.$monthPicker;
        }

        this.$monthPicker = htmlToElement(`<div class="month-picker no-select">
                                              <div class="month-picker__year-select">
                                                    <span class="month-picker__year-select__previous fa fa-angle-left ChaynsCS-Color"></span>
                                                    <span class="month-picker__year-select__next fa fa-angle-right ChaynsCS-Color"></span>
                                              </div>
                                              <div class="month-picker__year-table">
                                                    <div class="month-picker__year-table__year">
                                                        <span></span>
                                                    </div>
                                              </div>
                                           </div>`);

        this.$captionYear = _('.month-picker__year-table__year span', this.$monthPicker);
        this.$yearTable = _('.month-picker__year-table', this.$monthPicker);

        this.$arrowPrevious = _('.month-picker__year-select__previous', this.$monthPicker);
        this.$arrowPrevious.addEventListener('click', () => {
            if (this.minDate && this.selectedYear === this.minDate.getFullYear()) {
                return;
            }
            this.selectedYear--;
            this.updateMonthTable();
            this.updateArrows();
        });

        this.$arrowNext = _('.month-picker__year-select__next', this.$monthPicker);
        this.$arrowNext.addEventListener('click', () => {
            if (this.maxDate && this.selectedYear === this.maxDate.getFullYear()) {
                return;
            }
            this.selectedYear++;
            this.updateMonthTable();
            this.updateArrows();
        });

        this.updateArrows();

        let months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

        for (let i = 0; i < 4; i++) {
            let $row = htmlToElement('<div class="month-picker__year-table__month-row"></div>');

            for (let j = 0; j < 3; j++) {
                let monthId = i * 3 + j;
                let $month = htmlToElement(`<div data-month-id="${monthId}">
                                                <span>${months[monthId]}</span>
                                           </div>`);
                $month.addEventListener('click', () => this.selected = getDate(this.selectedYear, $month.getAttribute('data-month-id')));
                $row.appendChild($month);
                this.$months.push($month);
            }
            this.$yearTable.appendChild($row);
        }
        this.updateMonthTable();
        return this.$monthPicker;
    }

    set selected(date: Date) {
        if (typeof date === 'number') {
            date = new Date(date);
        }

        if (this.isDateAllowed(date)) {
            this.selectedDate = date;

            if (this.callback) {
                this.callback(date);
            }

            this.updateMonthTable();
        }
    }

    updateArrows() {
        if (!this.isDateAllowed(new Date(this.selectedYear - 1, 11))) {
            this.$arrowPrevious.classList.add('hidden');
        } else {
            this.$arrowPrevious.classList.remove('hidden');
        }
        if (!this.isDateAllowed(new Date(this.selectedYear + 1, 0))) {
            this.$arrowNext.classList.add('hidden');
        } else {
            this.$arrowNext.classList.remove('hidden');
        }
    }

    showYear(year: number) {
        if (year && typeof year === 'number') {
            this.selectedYear = year;
            this.updateMonthTable();
        }
    }

    updateMonthTable() {
        if (!this.$monthPicker) {
            return;
        }
        this.$captionYear.innerHTML = this.selectedYear;
        let date = new Date(0);
        date.setFullYear(this.selectedYear);
        for (let $month of this.$months) {
            date.setMonth(parseInt($month.getAttribute('data-month-id'), 10));
            if (this.isDateAllowed(date)) {
                $month.firstElementChild.classList.remove('month--blocked');
            } else {
                $month.firstElementChild.classList.add('month--blocked');
            }
            if (date.getFullYear() === this.selectedDate.getFullYear() && date.getMonth() === this.selectedDate.getMonth()) {
                $month.firstElementChild.classList.add('ChaynsCS-Color', 'month--selected');
            } else {
                $month.firstElementChild.classList.remove('ChaynsCS-Color', 'month--selected');
            }
        }
        this.updateArrows();
    }

    isDateAllowed(date: Date) {
        let year = date.getFullYear();
        let month = date.getMonth();

        if ((!this.minDate && !this.maxDate)) {
            return true;
        }

        if (( this.minDate && year < this.minDate.getFullYear()) || (this.maxDate && year > this.maxDate.getFullYear())) {
            return false;
        }

        if (this.minDate && year === this.minDate.getFullYear() && month < this.minDate.getMonth()) {
            return false
        }

        if (this.maxDate && year === this.maxDate.getFullYear() && month > this.maxDate.getMonth()) {
            return false;
        }

        return true;
    }
}

function getDate(year, month) {
    let date = new Date(0);
    date.setFullYear(year);
    date.setMonth(month);
    return date;
}