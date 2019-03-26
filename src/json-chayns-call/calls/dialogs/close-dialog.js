/* eslint-disable no-unused-vars */

export default function closeDialog(req, res) {
    import(/* webpackChunkName: "dialog" */ '../../../ui/dialog/dialog').then(({ default: Dialog }) => {
        Dialog.hide();
    });
}
