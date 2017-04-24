import { closeWindow as closeWindowCall } from '../../json-native-calls/calls/index';

export default function closeWindow(req, res) {
    closeWindowCall(req.value.data).then((retVal) => {
        res.answer({
            status: retVal.status.code,
            data: retVal.data
        });
    });
}
