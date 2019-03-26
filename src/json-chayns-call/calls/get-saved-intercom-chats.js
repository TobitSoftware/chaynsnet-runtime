import { getSavedIntercomChats as getSavedIntercomChatsCall } from '../../json-native-calls/calls/index';

export default function getSavedIntercomChats(req, res) {
    if (!req.value || !req.value.itemId) {
        res.event(2, 'Field itemId missing.');
        return;
    }

    getSavedIntercomChatsCall(req.value.itemId).then((retVal) => {
        res.answer({
            status: retVal.status.code,
            data: retVal.data
        });
    });
}
