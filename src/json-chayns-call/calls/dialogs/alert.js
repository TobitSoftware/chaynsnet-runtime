export default function showAlert(req, res) {
    if (!req.value || req.value.dialog === undefined) {
        res.event(2, 'Field dialog missing.');
        return;
    }
    if ((req.value.dialog.buttons || []).length === 0) {
        res.event(2, 'Field dialog.buttons missing.');
        return;
    }

    import(/* webpackChunkName: "dialog" */ '../../../ui/dialog/dialog').then(({ default: Dialog }) => {
        Dialog.show(Dialog.type.ALERT, req.value.dialog)
            .then(buttonType => res.answer(buttonType));
    });
}
