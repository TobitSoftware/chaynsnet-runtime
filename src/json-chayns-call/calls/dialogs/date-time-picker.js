import Dialog from '../../../ui/dialog/dialog';
import { compareDate } from '../../../utils/helper';
import DATE_TYPE from '../../../constants/date-type';

export default function dateTimePicker(req, res) {
    const value = req.value;

    if (!value.dialog) {
        value.dialog = {};
    }

    value.dialog.selectedDate = (value.selectedDate === -1) ? null : value.selectedDate;
    value.dialog.minDate = (value.minDate === -1) ? null : value.minDate;
    value.dialog.maxDate = (value.maxDate === -1) ? null : value.maxDate;

    let dialogType;
    switch (value.type) {
        case DATE_TYPE.DATE_TIME:
            dialogType = Dialog.type.DATETIME;
            break;
        case DATE_TYPE.DATE:
            dialogType = Dialog.type.DATE;
            break;
        case DATE_TYPE.TIME:
            dialogType = Dialog.type.TIME;
            break;
        default:
            dialogType = Dialog.type.DATETIME;
    }

    // If Device is Mobile (width smaller 451px) and DialogType is DateTime
    // -> show first Date and then Time Dialog.
    if (window.outerWidth <= 450 && dialogType === Dialog.type.DATETIME) {
        const { dialog: { minDateTS, maxDateTS, selectedDateTS } } = value;
        Dialog.show(Dialog.type.DATE, value.dialog)
            .then((dateRes) => {
                const { selectedDate: selectedDateTs } = dateRes;
                const selectedDate = new Date(selectedDateTs * 1000);

                if (compareDate(new Date(minDateTS * 1000), selectedDate)) {
                    value.dialog.minDate = minDateTS;
                } else {
                    value.dialog.minDate = null;
                }

                if (compareDate(new Date(maxDateTS * 1000), selectedDate)) {
                    value.dialog.maxDate = maxDateTS;
                } else {
                    value.dialog.maxDate = null;
                }

                value.dialog.selectedDate = selectedDateTS;

                Dialog.show(Dialog.type.TIME, value.dialog)
                    .then((timeRes) => {
                        const timeDate = new Date(timeRes.selectedDate * 1000);

                        selectedDate.setHours(timeDate.getHours());
                        selectedDate.setMinutes(timeDate.getMinutes());

                        dateRes.selectedDate = (selectedDate.getTime() / 1000).toFixed(0);
                        dateRes.buttonType = timeRes.buttonType;

                        res.answer(dateRes);
                    });
            });
    } else {
        Dialog.show(dialogType, value.dialog)
            .then((ret) => {
                res.answer(ret);
            });
    }
}
