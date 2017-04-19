import Dialog from '../../../ui/dialog/dialog';

export default function showAlert(req, res) {
    if (!req.value || req.value.dialog === undefined) {
        return res.event(2, 'Field dialog missing.');
    }
    if ((req.value.dialog.buttons || []).length === 0) {
        return res.event(2, 'Field dialog.buttons missing.');
    }

    Dialog.show(Dialog.type.ALERT, req.value.dialog)
        .then(buttonType => res.answer(buttonType));
}
