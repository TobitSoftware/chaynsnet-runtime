import Dialog from '../../../ui/dialog/dialog';

export default function multiSelectDialog(req, res) {
    if (!req.value || req.value.dialog === undefined) {
        return res.event(2, 'Field dialog missing.');
    }

    if ((req.value.dialog.buttons || []).length === 0) {
        return res.event(2, 'Field dialog.buttons missing.');
    }

    if ((req.value.list || []).length === 0) {
        return res.event.throwEvent(2, 'Field list missing.');
    }

    req.value.dialog.list = req.value.list;

    Dialog.show(Dialog.type.SELECT, req.value.dialog)
        .then(retVal => res.answer(retVal));
}
