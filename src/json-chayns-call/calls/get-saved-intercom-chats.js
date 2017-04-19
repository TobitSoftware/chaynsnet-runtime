import { getSavedIntercomChats as getSavedIntercomChatsCall } from '../../json-native-calls/calls/index';

export default function getSavedIntercomChats(req, res) {
    if (!req.value || !req.value.itemId) {
        return res.event(2, 'Field itemId missing.');
    }

    getSavedIntercomChatsCall(req.value.itemId).then((retVal) => {
        res.answer({
            status: retVal.status.code,
            data: retVal.data
        });
    });
}
