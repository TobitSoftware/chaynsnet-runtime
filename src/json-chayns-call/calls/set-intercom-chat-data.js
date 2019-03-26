import { setIntercomChatData as setIntercomChatDataCall } from '../../json-native-calls/calls/index';

export default function setIntercomChatData(req, res) {
    if (!req.value || req.value.data === undefined) {
        res.event(2, 'Field data missing.');
        return;
    }

    setIntercomChatDataCall(req.value.data).then((retVal) => {
        res.answer({
            status: retVal.status.code,
            data: retVal.data
        });
    });
}
